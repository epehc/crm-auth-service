import express from "express";
import * as bodyParser from "body-parser";
import passport from "./middlewares/passport";
import authRoutes from "./routes/authRoutes";
import sequelize from "./database/db";

const app = express();

app.use(bodyParser.json());
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

