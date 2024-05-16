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
    forceCreateFlag,
  } = req.body;

  const contestQuestionScope = questionScope || "public";
  //check if all fields are provided
  if (
    [
      contestName,
      noOfQuestions,
      contestDuration,
      contestStartDateTime,
      contestEndDateTime,
      subject,
      level,
      forceCreateFlag,
    ].some((field) => field?.trim() === undefined || field?.trim() === "")
  ) {
    return res.status(400).send({
      success: false,
      message:
        "All Fields are required contestName, noOfQuestions, contestDuration, contestStartDateTime,contestEndDateTime, subject, level, forceCreateFlag",
    });
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
  if (contestQuestionScope == "private") {
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

    if (allQuestions.length == 0) {
      return res.status(400).send({
        success: false,
        message: "No questions found, Failed to create contest",
        data: {},
      });
    }

    // console.log(forceCreateFlag, allQuestions.length,noOfQuestions );
    //error if required no of question are not in db
    if (forceCreateFlag == false || forceCreateFlag == "false") {
      // console.log("Force is false do not create with less question")
      if (allQuestions.length != noOfQuestions) {
        return res.status(400).send({
          success: false,
          message: `${noOfQuestions} questions are not available to create contest only ${allQuestions.length} available`,
          date: {},
        });
      }
    }

    //error if required no of question are not in db
    // if (allQuestions.length != noOfQuestions) {
    //   return res.status(400).send({
    //     success: false,
    //     message: `${noOfQuestions} questions are not available to create contest only ${allQuestions.length} available`,
    //     date: {},
    //   });
    // }
    // console.log(
    //   "ALL QUES ARE:",
    //   allQuestions.map((qus) => qus._id)
    // );

    //create contest
    const createdContest = await contestModel
      .create({
        contestName,
        noOfQuestions: allQuestions.length,
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
  const contests = await contestModel
    .find({ createdBy: usr._id, isContestDeleted: false })
    .populate({
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
  const {
    contestId,
    contestName,
    contestDuration,
    contestStartDateTime,
    contestEndDateTime,
    isActive,
  } = req.body;

  if (!contestId) {
    return res
      .status(400)
      .send({ success: false, message: "contest Id is required", data: {} });
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
      message: "Invalid user OR Student cannot update contest",
      data: {},
    });
  }

  const fieldsToUpdate = {
    contestName,
    contestDuration,
    contestStartDateTime,
    contestEndDateTime,
    isActive,
  };

  Object.keys(fieldsToUpdate).forEach((key) => {
    if (fieldsToUpdate[key] === undefined) {
      delete fieldsToUpdate[key];
    }
  });

  if (Object.keys(fieldsToUpdate).length == 0) {
    return res.status(400).send({
      success: false,
      message: "No Data Found to update",
      data: fieldsToUpdate,
    });
  }

  //!!!! CONTINUE FROM HERE GIVING GOING IN THE BELOW TRY EVEN AFTER RETURNING IN CATCH !!!!!!
  const dbContest = await contestModel
    .findOne({ _id: contestId, createdBy: usr._id })
    .catch((er) => {
      console.log("EXCEPTION IN GETTING CONTEST");
      return res
        .status(500)
        .send({ success: false, message: er.message, data: er });
    });

  if (!dbContest) {
    return res.status(404).send({
      success: false,
      message: "contest does not exists with given credentials",
    });
  }

  try {
    console.log("CAM IN TRY", dbContest);
    const updatedFields = await contestModel.updateOne(
      { _id: contestId, createdBy: usr._id },
      {
        $set: fieldsToUpdate,
      },
      { runValidators: true }
    );

    //error if modified count is not 1 as we are updating only one question here
    if (updatedFields.modifiedCount != 1) {
      return res.status(400).send({
        success: false,
        message: "No fields updated",
        data: {},
      });
    }

    return res.status(201).send({
      success: true,
      message: "Contest Updated Successfully",
      data: fieldsToUpdate,
    });
  } catch (error) {
    console.log("CAME IN CATCH");
    return res.status(500).send({
      success: false,
      message: error.name || "Failed to update contest",
      data: error,
    });
  }
};

const deleteContestController = async (req, res) => {
  const { contestIds } = req.body;

  if (contestIds.length == 0) {
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

  try {
    const contestDeleteSummary = await contestModel
      .updateMany(
        {
          _id: { $in: contestIds },
          createdBy: usr._id,
          isContestDeleted: false,
        },
        {
          $set: { isContestDeleted: true },
        }
      )
      .catch((err) => {
        return res.status(500).send({
          success: false,
          message: "Failed to mark as deleted",
          data: err,
        });
      });

    if (contestDeleteSummary.modifiedCount == 0) {
      return res.status(400).send({
        success: false,
        message: "Nothing to delete",
        data: {},
      });
    }
    return res.status(200).send({
      success: true,
      message: "contests deleted successfully",
      data: {},
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.name || "Failed to update delete flag",
      data: error,
    });
  }
};

export {
  createContestController,
  getContestController,
  getAllContestsController,
  updateContestController,
  deleteContestController,
};
