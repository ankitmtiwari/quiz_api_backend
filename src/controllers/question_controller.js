import { userModel } from "../models/user_model.js";
import { questionModel } from "../models/question_model.js";
const createQuestionController = async (req, res) => {
  //get data sent from client
  const {
    question,
    allAnswers,
    correctAnswerIndex,
    subject,
    level,
    questionType,
    timeRequired,
  } = req.body;

  //check if atleast 2 options are given
  if (allAnswers.length < 2) {
    return res.status(400).send({
      success: false,
      message: "minimum two answers are required",
      data: { allAnswers },
    });
  }
  //check if all fields are provided
  if (
    [
      question,
      correctAnswerIndex,
      subject,
      level,
      questionType,
      timeRequired,
    ].some((field) => field?.trim() === undefined || field?.trim() === "")
  ) {
    return res
      .status(400)
      .send({ success: false, message: "All Fields are required" });
  }

  //check if user is available through middleware
  if (!req.user._id) {
    return res
      .status(401)
      .send({ success: false, message: "Invalid request", data: {} });
  }

  //check if user exists in db
  const usr = await userModel.findById(req.user._id);

  //error if no user
  if (!usr) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid user", data: {} });
  }

  try {
    const createdQuestion = await questionModel.create({
      question,
      allAnswers,
      correctAnswerIndex,
      subject,
      level,
      questionType,
      timeRequired,
      addedBy: req.user._id,
    });
    if (!createdQuestion) {
      return res
        .status(500)
        .send({ success: false, message: "Failed to add question", data: {} });
    }

    const c_que = await questionModel
      .findById(createdQuestion._id)
      .select("-addedBy");

    return res.status(201).send({
      success: true,
      message: "Question added successfully",
      data: c_que,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
      data: { error },
    });
  }
};

const updateQuestionController = async (req, res) => {
  res.send("Update Question Sucess");
};

const deleteQuestionController = async (req, res) => {
  res.send("Delete Question Sucess");
};

const getAllQuestionController = async (req, res) => {
  res.send("Get All Question Sucess");
};

export {
  createQuestionController,
  updateQuestionController,
  deleteQuestionController,
  getAllQuestionController,
};
