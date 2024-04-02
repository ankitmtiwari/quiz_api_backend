const registerUserController = async (req, res) => {
  res.send("Register the user");
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
