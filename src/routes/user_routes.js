import { Router } from "express";
import {
  deleteUserController,
  loginUserController,
  logoutUserController,
  registerUserController,
} from "../controllers/users_controller.js";

const userRouters = Router();

//default route is localhost(domain)/api/v1/users/
userRouters.route("/register").post(registerUserController);
userRouters.route("/login").post(loginUserController);
userRouters.route("/logout").post(logoutUserController);
userRouters.route("/delete").post(deleteUserController);

export default userRouters;
