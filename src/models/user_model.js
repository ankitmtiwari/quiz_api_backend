import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

//to check every time userSchema is saving something if password is changed or not
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


//check if the given password matches with the stored password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const userModel = mongoose.model("User", userSchema);
