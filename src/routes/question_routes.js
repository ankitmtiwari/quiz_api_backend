import { Router } from "express";
import {
  createQuestionController,
  deleteQuestionController,
  getAllQuestionController,
  updateQuestionController,
} from "../controllers/question_controller.js";
import { checkAuthMiddleware } from "../middlewares/auth_middleware.js";

const questionRoutes = Router();

questionRoutes
  .route("/create")
  .post(checkAuthMiddleware, createQuestionController);
questionRoutes
  .route("/update")
  .post(checkAuthMiddleware, updateQuestionController);
questionRoutes
  .route("/delete")
  .post(checkAuthMiddleware, deleteQuestionController);
questionRoutes
  .route("/getall")
  .post(checkAuthMiddleware, getAllQuestionController);

export { questionRoutes };
