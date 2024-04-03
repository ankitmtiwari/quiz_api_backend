const createQuestionController = async (req, res) => {
  res.send("Create Question Sucess");
};

const updateQuestionController = async (req, res) => {
  res.send("Update Question Sucess");
};

const deleteQuestionController = async (req, res) => {
  res.send("Delete Question Sucess");
};

const getAllQuestionController = async (req, res) => {
  res.send("Get All Question Sucess");
};

export {
  createQuestionController,
  updateQuestionController,
  deleteQuestionController,
  getAllQuestionController,
};
