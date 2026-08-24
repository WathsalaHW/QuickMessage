import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/db";

const app = express();
const PORT = process.env.PORT


app.listen(PORT,() => {
    connectDB();
    console.log("Server is up and running on PORT:", PORT);
});