import { Router } from "express";
import { sendSuccessResponse } from "../../utils/response.util.js";
import { asyncHandler } from "../../middlewares/error.middleware.js";
import { validateUser } from "../../middlewares/auth.middleware.js";
import {
  createLoadTest,
  getLoadTestStatus,
  getLoadTestResult,
  getAllLoadTests,
  getLoadTestResults,
} from "./load-test.service.js";

const router = Router();

router.use(asyncHandler(validateUser));

router.post("/", asyncHandler(async (request, response) => {
  const result = await createLoadTest(request.body, request.user.id);
  sendSuccessResponse(response, result);
}));

router.get("/", asyncHandler(async (_, response) => {
  const result = await getAllLoadTests();
  sendSuccessResponse(response, result);
}));

router.get("/results", asyncHandler(async (request, response) => {
  const filters = {
    method: request.query.method,
    url: request.query.url,
    minErrorRate: request.query.minErrorRate ? parseFloat(request.query.minErrorRate) : undefined,
    maxErrorRate: request.query.maxErrorRate ? parseFloat(request.query.maxErrorRate) : undefined,
    minThroughput: request.query.minThroughput ? parseFloat(request.query.minThroughput) : undefined,
    maxThroughput: request.query.maxThroughput ? parseFloat(request.query.maxThroughput) : undefined,
  };

  const result = await getLoadTestResults(filters);
  sendSuccessResponse(response, result);
}));

router.get("/:testId/status", asyncHandler(async (request, response) => {
  const result = await getLoadTestStatus(request.params.testId);
  sendSuccessResponse(response, result);
}));

router.get("/:testId/result", asyncHandler(async (request, response) => {
  const result = await getLoadTestResult(request.params.testId);
  sendSuccessResponse(response, result);
}));

export default router;
