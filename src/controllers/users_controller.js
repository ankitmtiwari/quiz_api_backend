import bcrypt from "bcrypt";
import { userModel } from "../models/user_model.js";

const registerUserController = async (req, res) => {
  const userData = req.body;
  console.log(userData);
  // res.status(200).send({ message: `Register the user ${userData}` });
  try {
    await userModel
      .create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        schoolName: userData.schoolName,
        standard: userData.standard,
        role: userData.role.toLowerCase(),
      })
      .then((user) => {
        res.status(201).json({ user: user });
      })
      .catch((err) => {
        if (err) {
          return res.status(400).json({ error: err });
        }
      });
  } catch (error) {
    console.log("Failed to create/register new user");
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

export {
  registerUserController,
  loginUserController,
  logoutUserController,
  deleteUserController,
};
