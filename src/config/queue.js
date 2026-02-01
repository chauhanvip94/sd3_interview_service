import { Queue } from "bullmq";
import redis from "./redis.js";

export const loadTestQueue = new Queue("load-tests", {
  connection: redis,
});
