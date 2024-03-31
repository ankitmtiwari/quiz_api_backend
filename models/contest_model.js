import mongoose from "mongoose";

const quizContestSchema = mongoose.Schema(
  {
    noOfQuestions: {
      typeof: Number,
      require: [true, "Number of questions is contest is required"],
    },
    questions: [
      {
        typeof: mongoose.Types.ObjectId,
        ref: "Question",
      },
    ],
    contestDuration: {
      typeof: Number,
      require: [true, "Duration of contest is required"],
    },
  },
  { timestamp: true }
);

export const contestModel = mongoose.models("Contest", quizContestSchema);
