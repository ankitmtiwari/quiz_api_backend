import { contestModel } from "../models/contest_model.js";
import { questionModel } from "../models/question_model.js";
import { userModel } from "../models/user_model.js";

const createContestController = async (req, res) => {
  const {
    contestName,
    noOfQuestions,
    contestDuration,
    contestStartDateTime,
    contestEndDateTime,
    questionScope,
    subject,
    level,
  } = req.body;

  const contestScope = questionScope || "public";
  //check if all fields are provided
  if (
    [
      contestName,
      noOfQuestions,
      contestDuration,
      contestStartDateTime,
      contestEndDateTime,
    ].some((field) => field?.trim() === undefined || field?.trim() === "")
  ) {
    return res
      .status(400)
      .send({ success: false, message: "All Fields are required" });
  }

  //match parameters for the contest questions
  const matchConditions = {};
  // Add conditions for provided parameters
  if (level) {
    matchConditions.level = level;
  }
  if (subject) {
    matchConditions.subject = subject;
  }
  if (contestScope == "private") {
    matchConditions.addedBy = req.user._id;
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
  if (!usr || usr.role == "student") {
    return res.status(401).json({
      success: false,
      message: "Invalid user OR Student cannot create contest",
      data: {},
    });
  }

  try {
    // console.log("Filter Conditions are:", matchConditions);
    const allQuestions = await questionModel
      .aggregate([
        { $match: matchConditions },
        { $sample: { size: parseInt(noOfQuestions) } },
      ])
      .catch((err) => {
        return res.status(500).send({
          success: false,
          message: err.message || "Fetching question for contest pipe broken",
          data: err,
        });
      });

    //error if required no of question are not in db
    if (allQuestions.length != noOfQuestions) {
      return res.status(400).send({
        success: false,
        message: `${noOfQuestions} questions are not available to create contest only ${allQuestions.length} available`,
        date: {},
      });
    }
    // console.log(
    //   "ALL QUES ARE:",
    //   allQuestions.map((qus) => qus._id)
    // );

    //create contest
    const createdContest = await contestModel
      .create({
        contestName,
        noOfQuestions,
        allQuestions,
        contestDuration,
        contestStartDateTime,
        contestEndDateTime,
        createdBy: req.user._id,
      })
      .catch((er) => {
        throw er;
      });

    //populate question allAnswers and correctAnswerIndex for each question of the contest
    await createdContest
      .populate({
        path: "allQuestions",
        select: "question allAnswers correctAnswerIndex",
      })
      .catch((er) => {
        return res.status(500).send({
          success: false,
          message: "populate question Failed",
          data: {},
        });
      });

    // console.log(d);
    return res.status(200).send({
      success: true,
      message: "Contest Created Successfully",
      data: createdContest,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
      data: { error },
    });
  }
};

const getContestController = async (req, res) => {
  const { contestId } = req.body;

  if (contestId == undefined || contestId == "") {
    return res
      .status(400)
      .send({ success: false, message: "contest id is required", data: {} });
  }

  if (!req.user._id) {
    //check if user is available through middleware
    return res
      .status(401)
      .send({ success: false, message: "Invalid request", data: {} });
  }

  //check if user exists in db
  const usr = await userModel.findById(req.user._id);

  //error if no user
  if (!usr) {
    return res.status(401).json({
      success: false,
      message: "Invalid user",
      data: {},
    });
  }
  const contest = await contestModel.findById(contestId);

  if (!contest) {
    return res.status(404).send({
      success: false,
      message: "No contest found Or Invalid credentials",
      data: {},
    });
  }

  await contest.populate({
    path: "allQuestions createdBy",
    select:
      "question allAnswers timeRequired firstName lastName schoolName userName -_id",
  });

  res.status(200).send({
    success: true,
    message: "contest fetched successfully",
    data: contest,
  });
};

const getAllContestsController = async (req, res) => {
  if (!req.user._id) {
    //check if user is available through middleware
    return res
      .status(401)
      .send({ success: false, message: "Invalid request", data: {} });
  }

  //check if user exists in db
  const usr = await userModel.findById(req.user._id);

  //error if no user
  if (!usr) {
    return res.status(401).json({
      success: false,
      message: "Invalid user",
      data: {},
    });
  }
  const contests = await contestModel.find({ createdBy: usr._id }).populate({
    path: "allQuestions",
    select: "question allAnswers correctAnswerIndex timeRequired",
  });

  if (contests.length == 0) {
    return res.status(404).send({
      success: false,
      message: "No contest found Or Invalid credentials",
      data: {},
    });
  }

  //   await contests.populate({
  //     path: "allQuestions",
  //     select: "question allAnswers correctAnswerIndex timeRequired",
  //   });

  res.status(200).send({
    success: true,
    message: "contests fetched successfully",
    data: contests,
  });
};

const updateContestController = async (req, res) => {
  res.send("UPDATED CONTEST");
};

const deleteContestController = async (req, res) => {
  res.send("DELETED CONTEST");
};

export {
  createContestController,
  getContestController,
  getAllContestsController,
  updateContestController,
  deleteContestController,
};
