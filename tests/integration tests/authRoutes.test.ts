jest.mock(
  "../../node_modules/@epehc/sharedutilities/middlewares/authMiddleware",
  () => ({
    authenticateJWT: (req: any, res: any, next: any) => next(),
  })
);

jest.mock(
  "../../node_modules/@epehc/sharedutilities/middlewares/authorize",
  () => ({
    authorize: () => (req: any, res: any, next: any) => next(),
  })
);

// Mock jsonwebtoken so that jwt.sign returns a dummy token
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "dummy-token"),
}));

import * as roleController from "../../src/controllers/roleController";
import { UserRole } from "@epehc/sharedutilities/enums/userRole";

// Stub route controllers from roleController to simulate responses.
jest
  .spyOn(roleController, "assignRole")
  .mockImplementation(async (req, res) => {
    res.status(200).json({ message: "Roles updated successfully" });
  });

jest
  .spyOn(roleController, "makeAdmin")
  .mockImplementation(async (req, res) => {
    res.status(200).json({ message: "User is now an admin" });
  });

jest
  .spyOn(roleController, "removeAdmin")
  .mockImplementation(async (req, res) => {
    res.status(200).json({ message: "User is no longer an admin" });
  });

jest
  .spyOn(roleController, "createUser")
  .mockImplementation(async (req, res) => {
    res.status(201).json({
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      roles: req.body.roles,
    });
  });

jest
  .spyOn(roleController, "getUserById")
  .mockImplementation(async (req, res) => {
    if (req.params.id === "found") {
      res.status(200).json({
        id: "found",
        name: "Found User",
        email: "found@example.com",
        roles: [UserRole.Reclutador],
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

// Stub passport to bypass Google OAuth flow.
jest.mock("../../src/middlewares/passport", () => ({
  authenticate: jest.fn((strategy: string, options: any) => {
    return (req: any, res: any, next: any) => next();
  }),
}));

import request from "supertest";
import express from "express";
import authRoutes from "../../src/routes/authRoutes";

// Setup Express app with authRoutes mounted.
// For the /google/callback route, inject req.user.
const app = express();
app.use(express.json());
// Middleware to inject req.user for google/callback route.
app.use((req, res, next) => {
  if (req.path === "/google/callback") {
    req.user = { id: "google-1", email: "google@example.com", roles: [UserRole.Reclutador] };
  }
  next();
});
app.use("/", authRoutes);

describe("Auth Routes Integration Tests", () => {
  test("GET /google should trigger passport authentication", async () => {
    const res = await request(app).get("/google");
    // Since passport is stubbed to call next(), if no response is sent,
    // Express returns 404 for unhandled routes. We check for that.
    expect(res.status).toBe(404);
  });

  test("GET /google/callback returns a JWT token", async () => {
    const res = await request(app).get("/google/callback");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token", "dummy-token");
  });

  test("POST /roles/assign returns role assignment success", async () => {
    const res = await request(app)
      .post("/roles/assign")
      .send({ id: "user-1", roles: [UserRole.Admin] });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Roles updated successfully" });
  });

  test("POST /roles/make-admin returns admin assignment success", async () => {
    const res = await request(app).post("/roles/make-admin").send({ id: "user-2" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "User is now an admin" });
  });

  test("POST /roles/remove-admin returns admin removal success", async () => {
    const res = await request(app).post("/roles/remove-admin").send({ id: "user-3" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "User is no longer an admin" });
  });

  test("POST /users creates a new user", async () => {
    const newUser = {
      id: "user-4",
      name: "New User",
      email: "new@user.com",
      roles: [UserRole.Reclutador],
    };
    const res = await request(app).post("/users").send(newUser);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(newUser);
  });

  test("GET /users/:id returns user details when found", async () => {
    const res = await request(app).get("/users/found");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: "found",
      name: "Found User",
      email: "found@example.com",
      roles: [UserRole.Reclutador],
    });
  });

  test("GET /users/:id returns 404 when user not found", async () => {
    const res = await request(app).get("/users/notfound");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "User not found" });
  });
});