import { Router } from "express";
import { checkAuthMiddleware } from "../middlewares/auth_middleware.js";
import { createContestController } from "../controllers/contest_controller.js";

const contestRouter = Router();

contestRouter
  .route("/create")
  .post(checkAuthMiddleware, createContestController);
contestRouter.route("/get").get(checkAuthMiddleware);
contestRouter.route("/update").post(checkAuthMiddleware);
contestRouter.route("/delete").post(checkAuthMiddleware);

export { contestRouter };
