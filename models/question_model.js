import mongoose from "mongoose";

const questionSchema = mongoose.Schema(
  {
    question: {
      typeof: String,
      require: [true, "Question is required"],
    },
    allAnswers: [
      {
        typeof: String,
        require: true,
      },
    ],
    correctAnswerIndex: {
      typeof: Number,
      require: [true, "Correct Answer Index is required"],
    },
    subject: {
      typeof: String,
      require: true,
    },
    level: {
      typeof: String,
      require: true,
      enum: ["easy, medium, hard"],
      default:"medium"
    },
    questionType: {
      typeof: String,
      require: true,
      enum: ["mcq", "true_False"],
      default:"mcq"
    },
    timeRequired: {
      typeof: Number,
      require: [true, "time required in mandatory"], //Always consider it in seconds
    },
    addedBy: {
      typeof: mongoose.Types.ObjectId,
      ref: "User",
      require: [true, "Added by user is requred"],
    },
  },
  { timestamp: true }
);

export const questionModel = mongoose.models("Question", questionSchema);
