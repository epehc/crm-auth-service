import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config()

const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USERNAME!,
    process.env.DB_PASSWORD!,
    {
    host: process.env.DB_HOST!,
    dialect: "postgres",
    logging: true, // Disable SQL logs in the console
    }
);

export default sequelize;
