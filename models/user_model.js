import mongoose from "mongoose";

const userSchema = mongoose.schema(
  {
    firstName: {
      typeof: String,
      require: [true, "first name is required"],
      lowercase: true,
      trim: true,
    },
    lastName: {
      typeof: String,
      require: [true, "last name is required"],
      lowercase: true,
      trim: true,
    },
    email: {
      typeof: String,
      require: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique:true
    },
    phoneNumber: {
      typeof: Number,
      require: [true, "Phone number is required"],
    },
    schoolName: {
      typeof: String,
      require: false,
    },
    standard: {
      typeof: String,
      require: false,
    },
    role:{
        typeof:String,
        enum:["student","teacher","superUser","admin"],
        default:"student"
    }
  },
  { timestamp: true }
);

export const userModel = mongoose.models("User", userSchema);
