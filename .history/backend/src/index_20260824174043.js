import express from "express";
import "dotenv/config";
import dns from "node:dns";
import User from "./models/user.model.js";
import { connectDB } from "./lib/db.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectDB();
  console.log("Server is up and running on PORT:", PORT);
});
