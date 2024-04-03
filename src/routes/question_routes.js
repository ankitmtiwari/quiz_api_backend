import { Router } from "express";
import {
  createQuestionController,
  deleteQuestionController,
  getAllQuestionController,
  updateQuestionController,
} from "../controllers/question_controller.js";

const questionRoutes = Router();

questionRoutes.route("/create").post(createQuestionController);
questionRoutes.route("/update").post(updateQuestionController);
questionRoutes.route("/delete").post(deleteQuestionController);
questionRoutes.route("/getall").post(getAllQuestionController);

export { questionRoutes };
