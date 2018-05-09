import dotenv from "dotenv";
import fs from "fs";

console.debug("Using .env file to supply config environment  variables.");
dotenv.config({path: ".env"});

export const ENVIRONMENT = process.env.NODE_ENV;

const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const PORT = process.env.PORT;