import { Worker } from "bullmq";
import axios from "axios";
import PQueue from "p-queue";
import redis from "../config/redis.js";
import loadTestRepository from "../repositories/load-test.repository.js";
import loadTestMetricsRepository from "../repositories/load-test-metrics.repository.js";
import { LOAD_TEST_STATUS } from "../constant/load-test.constant.js";

const calculateP95 = (times) => {
  if (times.length === 0) return 0;
  const sorted = [...times].sort((a, b) => a - b);
  const index = Math.ceil(0.95 * sorted.length) - 1;
  return sorted[index];
};

const processLoadTest = async (job) => {
  const { testId, url, method, headers, payload, totalRequests, concurrency } = job.data;

  const queue = new PQueue({ concurrency });
  const responseTimes = [];
  let successCount = 0;
  let errorCount = 0;

  await loadTestRepository.updateLoadTest({id: testId, status: LOAD_TEST_STATUS.RUNNING, startedAt: new Date()});

  const startTime = Date.now();

  for (let i = 0; i < totalRequests; i++) {
    queue.add(async () => {
      const requestStart = Date.now();
      try {
        await axios({
          url,
          method,
          headers: headers || {},
          data: payload || undefined,
          timeout: 30000,
        });
        successCount++;
      } catch {
        errorCount++;
      } finally {
        responseTimes.push(Date.now() - requestStart);
      }
    });
  }

  await queue.onIdle();

  const totalTime = (Date.now() - startTime) / 1000;
  const avgResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;
  const p95ResponseTime = calculateP95(responseTimes);
  const throughput = totalTime > 0 ? totalRequests / totalTime : 0;

  await loadTestMetricsRepository.create({
    testId,
    totalRequests,
    successCount,
    errorCount,
    avgResponseTime,
    p95ResponseTime,
    throughput,
  });

  await loadTestRepository.updateLoadTest({id: testId, status: LOAD_TEST_STATUS.COMPLETED, completedAt: new Date()});

  return { testId, successCount, errorCount, avgResponseTime };
};

export const startLoadTestWorker = () => {
  const worker = new Worker("load-tests", processLoadTest, {
    connection: redis,
  });

  worker.on("completed", (job, result) => {
    console.log(`Load test ${result.testId} completed`);
  });

  worker.on("failed", async (job, err) => {
    console.error(`Load test ${job.data.testId} failed:`, err.message);
    await loadTestRepository.updateLoadTest({id: job.data.testId, status: LOAD_TEST_STATUS.FAILED, completedAt: new Date()});
  });

  return worker;
};
