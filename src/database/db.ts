import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config()

const sequelize = process.env.DATABASE_URL
? new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: true, // Disable logging in production
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

//To force the database to sync with the models every time the server starts, uncomment the following code
const syncDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected");

        await sequelize.sync({ force: true }); 
        console.log("Database synchronized");
    } catch (error) {
        console.error("Error syncing database:", error);
    }
};

//syncDB();


export default sequelize;
