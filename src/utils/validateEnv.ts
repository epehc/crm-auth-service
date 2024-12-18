import dotenv from "dotenv";

dotenv.config();

export const validateEnv = () => {
    if (!process.env.GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID is missing in .env");
    if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error("GOOGLE_CLIENT_SECRET is missing in .env");
    if (!process.env.GOOGLE_CALLBACK_URL) throw new Error("GOOGLE_CALLBACK_URL is missing in .env");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");
    if (!process.env.JWT_EXPIRATION) throw new Error("JWT_EXPIRATION is missing in .env");
};
