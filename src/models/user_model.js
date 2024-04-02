import mongoose from "mongoose";

const userSchema = mongoose.schema(
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
    username: {
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
    },
  },
  { timestamp: true }
);

export const userModel = mongoose.models("User", userSchema);
