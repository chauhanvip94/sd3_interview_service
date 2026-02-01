import loadTestRepository from "../../repositories/load-test.repository.js";
import { loadTestQueue } from "../../config/queue.js";
import { NotFoundError } from "../../utils/error.util.js";

export const createLoadTest = async (data, userId) => {
  const loadTest = await loadTestRepository.create({
    url: data.url,
    method: data.method.toUpperCase(),
    totalRequests: data.totalRequests,
    concurrency: data.concurrency,
    headers: data.headers || null,
    payload: data.payload || null,
    userId: userId,
    status: "QUEUED",
  });

  await loadTestQueue.add("run-test", {
    testId: loadTest.id,
    url: loadTest.url,
    method: loadTest.method,
    totalRequests: loadTest.totalRequests,
    concurrency: loadTest.concurrency,
    headers: loadTest.headers,
    payload: loadTest.payload,
  });

  return loadTest;
};

export const getLoadTestStatus = async (testId) => {
  const loadTest = await loadTestRepository.findById(testId);
  if (!loadTest) {
    throw new NotFoundError("Load test not found");
  }
  return {
    id: loadTest.id,
    status: loadTest.status,
    startedAt: loadTest.startedAt,
    completedAt: loadTest.completedAt,
  };
};

export const getLoadTestResult = async (testId) => {
  const loadTest = await loadTestRepository.findByIdWithMetrics(testId);
  if (!loadTest) {
    throw new NotFoundError("Load test not found");
  }

  return loadTest;
};

export const getAllLoadTests = async (filters = {}) => {
  return loadTestRepository.findWithFilters(filters);
};

export const getLoadTestResults = async (filters) => {
  const results = await loadTestRepository.findWithFilters({
    ...filters,
    status: "COMPLETED",
  });

  return results.map((loadTest) => {
    const metrics = loadTest.metrics;
    const errorRate = metrics && metrics.totalRequests > 0
      ? (metrics.errorCount / metrics.totalRequests) * 100
      : 0;

    return {
      id: loadTest.id,
      url: loadTest.url,
      method: loadTest.method,
      totalRequests: loadTest.totalRequests,
      concurrency: loadTest.concurrency,
      status: loadTest.status,
      startedAt: loadTest.startedAt,
      completedAt: loadTest.completedAt,
      metrics: metrics ? {
        successCount: metrics.successCount,
        errorCount: metrics.errorCount,
        errorRate: parseFloat(errorRate.toFixed(2)),
        avgResponseTime: parseFloat(metrics.avgResponseTime) + 'ms',
        p95ResponseTime: parseFloat(metrics.p95ResponseTime) + 'ms',
        throughput: parseFloat(metrics.throughput) + 'req/s',
      } : null,
    };
  });
};
