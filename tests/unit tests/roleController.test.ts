import { Request, Response } from "express";
import Usuario from "../../src/models/usuario";
import {
  assignRole,
  makeAdmin,
  removeAdmin,
  createUser,
  getUserById,
} from "../../src/controllers/roleController";
import { validationResult } from "express-validator";
import { UserRole } from "@epehc/sharedutilities/enums/userRole";

jest.mock("../../src/models/usuario");
jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: () => [],
  })),
}));

const mockResponse = {
  json: jest.fn(),
  status: jest.fn(() => mockResponse),
  send: jest.fn(),
} as unknown as Response;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("assignRole", () => {
  test("should assign roles successfully", async () => {
    const fakeUser: any = {
      id: "user-1",
      roles: [],
      save: jest.fn().mockResolvedValue(true),
    };

    // Pass validation
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    jest.spyOn(Usuario, "findByPk").mockResolvedValue(fakeUser);

    const req = {
      body: { userId: "user-1", roles: [UserRole.Admin] },
    } as unknown as Request;

    await assignRole(req, mockResponse);

    expect(Usuario.findByPk).toHaveBeenCalledWith("user-1");
    expect(fakeUser.roles).toEqual([UserRole.Admin]);
    expect(fakeUser.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Roles updated successfully",
      user: fakeUser,
    });
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });
    const req = { body: {} } as unknown as Request;
    await assignRole(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid input" }],
    });
  });

  test("should return 400 for invalid input", async () => {
    // Pass validation but missing userId or invalid roles
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    const req = {
      body: { userId: "user-1", roles: "not-an-array" },
    } as unknown as Request;
    await assignRole(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Invalid input for role assignment",
    });
  });

  test("should return 404 if user not found", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    jest.spyOn(Usuario, "findByPk").mockResolvedValue(null);
    const req = {
      body: { userId: "user-1", roles: [UserRole.Admin] },
    } as unknown as Request;
    await assignRole(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});

describe("makeAdmin", () => {
  test("should make a user admin successfully", async () => {
    const fakeUser: any = {
      id: "user-2",
      roles: [],
      save: jest.fn().mockResolvedValue(true),
    };

    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    jest.spyOn(Usuario, "findByPk").mockResolvedValue(fakeUser);

    const req = {
      body: { userId: "user-2" },
    } as unknown as Request;

    await makeAdmin(req, mockResponse);

    expect(Usuario.findByPk).toHaveBeenCalledWith("user-2");
    expect(fakeUser.roles).toContain(UserRole.Admin);
    expect(fakeUser.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User is now an admin",
      user: fakeUser,
    });
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });
    const req = { body: {} } as unknown as Request;
    await makeAdmin(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid input" }],
    });
  });

  test("should return 404 if user not found", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    jest.spyOn(Usuario, "findByPk").mockResolvedValue(null);
    const req = {
      body: { userId: "user-2" },
    } as unknown as Request;
    await makeAdmin(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});

describe("removeAdmin", () => {
  test("should remove admin role successfully", async () => {
    const fakeUser: any = {
      id: "user-3",
      roles: [UserRole.Admin, UserRole.Reclutador],
      save: jest.fn().mockResolvedValue(true),
    };

    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    jest.spyOn(Usuario, "findByPk").mockResolvedValue(fakeUser);

    const req = {
      body: { userId: "user-3" },
    } as unknown as Request;

    await removeAdmin(req, mockResponse);

    expect(Usuario.findByPk).toHaveBeenCalledWith("user-3");
    expect(fakeUser.roles).not.toContain(UserRole.Admin);
    expect(fakeUser.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User is no longer an admin",
      user: fakeUser,
    });
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });
    const req = { body: {} } as unknown as Request;
    await removeAdmin(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid input" }],
    });
  });

  test("should return 404 if user not found", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    jest.spyOn(Usuario, "findByPk").mockResolvedValue(null);
    const req = { body: { userId: "user-3" } } as unknown as Request;
    await removeAdmin(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});

describe("createUser", () => {
  test("should return existing user if found", async () => {
    const existingUser = new Usuario({ id: "user-4", name: "Test User", email: "a@b.com", roles: [UserRole.Reclutador] });
    jest.spyOn(Usuario, "findOne").mockResolvedValue(existingUser);

    const req = {
      body: { id: "user-4", name: "Test User", email: "a@b.com", roles: [UserRole.Reclutador] },
    } as unknown as Request;

    await createUser(req, mockResponse);

    expect(Usuario.findOne).toHaveBeenCalledWith({ where: { id: "user-4" } });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(existingUser);
  });

  test("should create a new user if not found", async () => {
    jest.spyOn(Usuario, "findOne").mockResolvedValue(null);
    const newUser = { id: "user-5", name: "New User", email: "new@user.com", roles: [UserRole.Reclutador] };
    jest.spyOn(Usuario, "create").mockResolvedValue(newUser);

    const req = {
      body: { id: "user-5", name: "New User", email: "new@user.com", roles: [UserRole.Reclutador] },
    } as unknown as Request;

    await createUser(req, mockResponse);

    expect(Usuario.create).toHaveBeenCalledWith({
      id: "user-5",
      name: "New User",
      email: "new@user.com",
      roles: [UserRole.Reclutador],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(newUser);
  });

  test("should return 500 on user creation error", async () => {
    jest.spyOn(Usuario, "findOne").mockResolvedValue(null);
    jest.spyOn(Usuario, "create").mockRejectedValue(new Error("Creation error"));

    const req = {
      body: { id: "user-6", name: "Error User", email: "error@user.com", roles: [UserRole.Reclutador] },
    } as unknown as Request;

    await createUser(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});

describe("getUserById", () => {
  test("should return user details if found", async () => {
    const fakeUser: any = {
      id: "user-7",
      name: "Found User",
      email: "found@user.com",
      roles: [UserRole.Reclutador],
    };
    jest.spyOn(Usuario, "findOne").mockResolvedValue(fakeUser);

    const req = { params: { id: "user-7" } } as unknown as Request;
    await getUserById(req, mockResponse);
    expect(Usuario.findOne).toHaveBeenCalledWith({ where: { id: "user-7" } });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: fakeUser.id,
      name: fakeUser.name,
      email: fakeUser.email,
      roles: fakeUser.roles,
    });
  });

  test("should return 404 if user is not found", async () => {
    jest.spyOn(Usuario, "findOne").mockResolvedValue(null);
    const req = { params: { id: "user-8" } } as unknown as Request;
    await getUserById(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  test("should return 500 on error", async () => {
    jest.spyOn(Usuario, "findOne").mockRejectedValue(new Error("DB error"));
    const req = { params: { id: "user-9" } } as unknown as Request;
    await getUserById(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});