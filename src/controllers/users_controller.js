import bcrypt from "bcrypt";
import { userModel } from "../models/user_model.js";
import { ApiError } from "../utils/api_error.js";

const registerUserController = async (req, res) => {
  //get all the fields
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    phoneNumber,
    schoolName,
    role,
  } = req.body;

  //check if required fields are empty
  if (
    [
      firstName,
      lastName,
      userName,
      email,
      password,
      phoneNumber,
      schoolName,
      role,
    ].some((field) => field?.trim() === undefined || field?.trim() === "")
  ) {
    return res
      .status(400)
      .send({ success: false, message: "All Fields are required" });
  }

  // check if user already exists with email or username
  const existingUser = await userModel.findOne({
    $or: [{ userName }, { email }],
  });

  if (existingUser) {
    console.log(existingUser);
    return res.status(400).send({
      success: false,
      message: "User Already Exists with email or username",
    });
  }

  //create new user
  try {
    const user = await userModel.create({
      firstName: firstName,
      lastName: lastName,
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
      password: password,
      phoneNumber: phoneNumber,
      schoolName: schoolName,
      role: role.toLowerCase(),
    });
  } catch (error) {
    console.log("Failed to create/register new user", error);
  }
};

const loginUserController = async (req, res) => {
  res.send("Login the user");
};

const logoutUserController = async (req, res) => {
  res.send("Logout the user");
};

const deleteUserController = async (req, res) => {
  res.send("Delete the user");
};

const updatePasswordController = async (req, res) => {
  const { email, userName, oldPassword, newPassword } = req.body;

  if (
    [oldPassword, newPassword].some(
      (field) => field === "" || field === undefined || field === null
    )
  ) {
    return res
      .status(400)
      .send({ success: false, message: "Passwords cannot be empty" });
  }
  // console.log(email, userName, newPassword);
  // check if user already exists with email or username
  const existingUser = await userModel.findOne({
    $or: [{ userName }, { email }],
  });

  if (!existingUser) {
    return res.status(400).send({ success: false, message: "User Not exists" });
  }

  const isPasswordCorrect = await existingUser.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .send({ success: false, message: "old password does not match" });
  }

  existingUser.password = newPassword;
  await existingUser.save({ validateBeforeSave: false });

  return res
    .status(201)
    .send({ success: true, message: "Password Changed successfully" });
};

export {
  registerUserController,
  loginUserController,
  logoutUserController,
  deleteUserController,
  updatePasswordController,
};
