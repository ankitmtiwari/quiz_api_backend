import mongoose from "mongoose";

const questionSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    allAnswers: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswerIndex: {
      type: Number,
      required: [true, "Correct Answer Index is required"],
    },
    subject: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    questionType: {
      type: String,
      required: true,
      enum: ["mcq", "true_False"],
      default: "mcq",
    },
    timeRequired: {
      type: Number,
      required: [true, "time required in mandatory"], //Always consider it in seconds
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Added by user is requred"],
    },
  },
  { timestamps: true }
);

export const questionModel = mongoose.model("Question", questionSchema);
