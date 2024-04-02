import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//global middleware setup
app.use(
  cors({
    origin: "*",
    credential: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//All Routes
import userRouters from "./src/routes/user_routes.js";
import { questionRoutes } from "./src/routes/question_routes.js";

app.use("/api/v1/users", userRouters);
app.use("/api/v1/questions", questionRoutes);

export { app };
