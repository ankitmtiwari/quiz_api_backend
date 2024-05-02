import mongoose from "mongoose";

const quizContestSchema = mongoose.Schema(
  {
    contestName: {
      type: "String",
      require: true,
      default: "Simple Quiz Contest",
    },
    // noOfQuestions: {
    //   type: Number,
    //   require: [true, "Number of questions is contest is required"],
    // },
    allQuestions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Question",
      },
    ],
    contestDuration: {
      type: Number,
      require: [true, "Duration of contest is required"],
    },
    isActive:{
      type:Boolean,
      require:[true,"Contest Status is required"],
      default:true
    }
  },
  { timestamp: true }
);

export const contestModel = mongoose.model("Contest", quizContestSchema);
