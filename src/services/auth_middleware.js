import jwt from "jsonwebtoken";
import { userModel } from "../models/user_model.js";

export const checkAuthMiddleware = async (req, res, next) => {
  try {
    console.log("CAME IN AUTH MIDDLEWARE");
    const accessToken =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .send({ success: false, message: "Unauthorised request", data: {} });
    }

    const decodedToken = jwt.verify(
      accessToken,
      "Mai chhota hu chhota hi rahunga"
    );

    const user = await userModel
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid Access Token", date: {} });
    }

    req.user = user;
    // console.log("User saved", req.user);
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: error?.message || "Invalid Access Token",
      data: error,
    });
  }
};
