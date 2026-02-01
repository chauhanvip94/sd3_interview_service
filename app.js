import "reflect-metadata";
import express from "express";
import database from "./src/config/database.js";
import redis from "./src/config/redis.js";
import modules from "./src/modules/index.js";
import { errorHandler, notFoundHandler } from "./src/middlewares/error.middleware.js";
import { startLoadTestWorker } from "./src/workers/load-test.worker.js";

const app = express();
const PORT = process.env.PORT || 3400;

app.use(express.json());

app.get("/health", async (_, response) => {
  const redisStatus = redis.status === "ready" ? "connected" : "disconnected";
  const dbStatus = database.isInitialized ? "connected" : "disconnected";
  response.json({
    success: true,
    message: "Server is running",
    redis: redisStatus,
    database: dbStatus,
  });
});

app.use("/api", modules);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await database.initialize();
    console.log("Database connected successfully");

    redis.on("connect", () => {
      console.log("Redis connected successfully");
    });

    redis.on("error", (err) => {
      console.error("Redis connection error:", err.message);
    });

    startLoadTestWorker();
    console.log("Load test worker started");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
