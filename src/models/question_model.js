import mongoose from "mongoose";

const questionSchema = mongoose.Schema(
  {
    question: {
      type: String,
      require: [true, "Question is required"],
    },
    allAnswers: [
      {
        type: String,
        require: true,
      },
    ],
    correctAnswerIndex: {
      type: Number,
      require: [true, "Correct Answer Index is required"],
    },
    subject: {
      type: String,
      require: true,
    },
    level: {
      type: String,
      require: true,
      enum: ["easy, medium, hard"],
      default:"medium"
    },
    questionType: {
      type: String,
      require: true,
      enum: ["mcq", "true_False"],
      default:"mcq"
    },
    timeRequired: {
      type: Number,
      require: [true, "time required in mandatory"], //Always consider it in seconds
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: [true, "Added by user is requred"],
    },
  },
  { timestamp: true }
);

export const questionModel = mongoose.model("Question", questionSchema);
