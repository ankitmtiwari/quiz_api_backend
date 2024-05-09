import jwt from "jsonwebtoken";
import { userModel } from "../models/user_model.js";

export const checkAuthMiddleware = async (req, res, next) => {
  try {
    // console.log("CAME IN AUTH MIDDLEWARE");
    const accessToken =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .send({ success: false, message: "Unauthorised request", data: {} });
    }

    // console.log("Middleware access:", accessToken);

    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await userModel
      .findById(decodedAccessToken?._id)
      .select("-password -refreshToken");

    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid Access Token", date: {} });
    }

    req.user = user;
    // console.log("Authorization Done");
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: error?.message || "Invalid Access Token",
      data: error,
    });
  }
};
