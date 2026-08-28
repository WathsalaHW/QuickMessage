import express from "express";
import cors from "cors";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import dns from "node:dns";
import User from "./models/user.model.js";
import { connectDB } from "./lib/db.js";
import clerkWebhook from "./webhooks/clerk.webhook.js";
import job from "./lib/cron.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Path to the public directory where the frontend dist was copied
const publicDir = path.join(process.cwd(), "public");

app.use("/api/webhooks/clerk", express.raw({ type: "application/json "}), clerkWebhook);

app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL || true,
    credentials: true,
  })
);
app.use(clerkMiddleware());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// --- Add your API routes here ---
// app.use("/api/users", userRoutes);

// Serve static frontend files in production
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  // Express 5 named splat parameter for SPA catch-all
  app.get("/*splat", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server is up and running on PORT:", PORT);

  if (process.env.NODE_ENV === "production") {
    job.start();
  }
});