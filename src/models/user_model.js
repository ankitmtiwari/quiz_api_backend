import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      require: [true, "first name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      require: [true, "last name is required"],
      trim: true,
    },
    userName: {
      type: String,
      require: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Password is required"],
    },
    phoneNumber: {
      type: Number,
      require: [true, "Phone number is required"],
    },
    schoolName: {
      type: String,
      require: false,
    },
    standard: {
      type: String,
      require: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "superUser", "admin"],
      default: "student",
      require: [true, "user role is required"],
    },
  },
  { timestamp: true }
);

export const userModel = mongoose.model("User", userSchema);