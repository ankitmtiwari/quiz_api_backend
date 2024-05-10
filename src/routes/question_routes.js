import { Router } from "express";
import {
  createQuestionController,
  deleteQuestionController,
  getAllQuestionController,
  updateQuestionController,
  getRandomQuestionController,
} from "../controllers/question_controller.js";
import { checkAuthMiddleware } from "../middlewares/auth_middleware.js";

const questionRoutes = Router();

//create question
questionRoutes
  .route("/create")
  .post(checkAuthMiddleware, createQuestionController);

//update question
questionRoutes
  .route("/update")
  .patch(checkAuthMiddleware, updateQuestionController);

//delete question
questionRoutes
  .route("/delete")
  .post(checkAuthMiddleware, deleteQuestionController);

//get all questions
questionRoutes
  .route("/getall")
  .post(checkAuthMiddleware, getAllQuestionController);

//get any one random question based on the given parameters
questionRoutes.route("/getRandomQuestion").get(getRandomQuestionController);

export { questionRoutes };
