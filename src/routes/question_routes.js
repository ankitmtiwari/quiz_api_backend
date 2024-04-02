import { Router } from "express";
import { createQuestionController } from "../controllers/question_controller.js";

const questionRoutes = Router();


questionRoutes.route("/create").post(createQuestionController)

export { questionRoutes };
