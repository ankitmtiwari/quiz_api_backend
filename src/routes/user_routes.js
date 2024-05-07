import { Router } from "express";
import {
  deleteUserController,
  loginUserController,
  logoutUserController,
  registerUserController,
  updatePasswordController,
} from "../controllers/users_controller.js";
import { checkAuthMiddleware } from "../services/auth_middleware.js";

const userRouters = Router();

//default route is localhost(domain)/api/v1/users/
userRouters.route("/register").post(registerUserController);
userRouters.route("/login").post(loginUserController);
userRouters.route("/logout").post(checkAuthMiddleware, logoutUserController);
userRouters.route("/delete").post(deleteUserController);
userRouters.route("/updatePassword").post(updatePasswordController);

export default userRouters;
