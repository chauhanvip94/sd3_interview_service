import { Router } from "express";
import loadTestRoutes from "./load-test/load-test.route.js";

const router = Router();

router.use("/load-tests", loadTestRoutes);

export default router;
