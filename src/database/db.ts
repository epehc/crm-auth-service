import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config()

const sequelize = process.env.DATABASE_URL
? new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false, // Disable logging in production
})
: new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USERNAME!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST!,
        dialect: "postgres",
        port: Number(process.env.DB_PORT),
    }
);

export default sequelize;
