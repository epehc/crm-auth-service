/// <reference path="../node_modules/@epehc/sharedutilities/types/express.d.ts" />

import express from "express";
import * as bodyParser from "body-parser";
import passport from "./middlewares/passport";
import authRoutes from "./routes/authRoutes";
import sequelize from "./database/db";
import {validateEnv} from "./utils/validateEnv";
import {setupSwagger} from "./utils/swagger";
import cors from "cors";

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL, // Your frontend's URL
    credentials: true, // Allow credentials (cookies, headers)
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
validateEnv();
setupSwagger(app);
app.use(passport.initialize());
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 4001;

sequelize
    .sync()
    .then(() => {
        console.log("Database connected!");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error("Database connection failed:", err));

