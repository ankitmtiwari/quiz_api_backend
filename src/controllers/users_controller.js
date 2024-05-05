import { userModel } from "../models/user_model.js";

const generateAuthToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const authToken = await user.createAuthToken();
    // const refreshToken = user.generateRefreshToken();

    user.authToken = authToken;
    await user.save({ validateBeforeSave: false });

    return { authToken };
  } catch (error) {
    console.log("ERROR: Failed to create and store auth Token", error);
    // throw new ApiError(
    //   500,
    //   "Something went wrong while generating referesh and access token"
    // );
  }
};

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

  //error if user already exists
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

    //server error if user not created
    if (!user) {
      res
        .status(500)
        .send({ success: false, message: "User not created", data: {} });
    }

    //get created users details from db except password
    const createdUser = await userModel.findById(user._id).select("-password");

    //error if no user found
    if (!createdUser) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong Try to login in",
      });
    }

    return res.status(201).send({
      success: true,
      message: "User Created Successfully",
      data: createdUser,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
      data: {},
    });
  }
};

const loginUserController = async (req, res) => {
  const { userName, email, password } = req.body;
  // const userName = "ankittiwari";
  // const email = "";
  // const password = "1234";

  //check if atleast email or username is given
  if (!userName && !email) {
    return res.status(400).send({
      success: false,
      message: "Username Or Email is required",
      data: {},
    });
  }

  //check if user exists with given username or email
  const existingUser = await userModel.findOne({
    $or: [{ userName }, { email }],
  });

  //error if no user found
  if (!existingUser) {
    return res.status(400).send({
      success: false,
      message: "User Does Not Exist with email or username",
      data: {},
    });
  }

  //if password matches or not
  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  //error if password is invalid
  if (!isPasswordValid) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid Credentials", data: {} });
  }

  //generate  auth Token to keep the user logged in
  // const authToken = await existingUser.createAuthToken();
  const authToken = await generateAuthToken(existingUser._id);

  //server error if unable to generate auth token
  if (!authToken) {
    return res.status(500).send({
      success: false,
      message: "Unable to generate auth token",
      data: {},
    });
  }

  //get the user details from db except passowrd
  const loggedInUser = await userModel
    .findById(existingUser._id)
    .select("-password -authToken");

  //cofigure options for storing token in browser cookier of the user
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("authToken", authToken, options)
    .send({
      success: true,
      message: "Login Successfull",
      data: { user: loggedInUser, authToken },
    });
};

const logoutUserController = async (req, res) => {
  const { uid } = req.body;

  await userModel.findByIdAndUpdate(
    // req.user._id,
    uid,
    {
      $unset: {
        authToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  //cofigure options for storing token in browser cookier of the user
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("authToken", options)
    .send({ success: true, message: "Logout Successfully", data: {} });
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
      .send({ success: false, message: "Passwords cannot be empty", data: {} });
  }
  // console.log(email, userName, newPassword);
  // check if user already exists with email or username
  const existingUser = await userModel.findOne({
    $or: [{ userName }, { email }],
  });

  if (!existingUser) {
    return res
      .status(400)
      .send({ success: false, message: "User Not exists", data: {} });
  }

  const isPasswordCorrect = await existingUser.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    return res.status(400).send({
      success: false,
      message: "old password does not match",
      data: { oldPassword: oldPassword },
    });
  }

  existingUser.password = newPassword;
  await existingUser.save({ validateBeforeSave: false });

  return res.status(201).send({
    success: true,
    message: "Password Changed successfully",
    data: { newPassword: newPassword },
  });
};

export {
  registerUserController,
  loginUserController,
  logoutUserController,
  deleteUserController,
  updatePasswordController,
};
