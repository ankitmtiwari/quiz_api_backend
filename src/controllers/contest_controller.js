const createContestController = async (req, res) => {
  res.send("CREATED CONTEST");
};
const getContestController = async (req, res) => {
  res.send("GET CONTEST");
};
const updateContestController = async (req, res) => {
  res.send("UPDATED CONTEST");
};
const deleteContestController = async (req, res) => {
  res.send("DELETED CONTEST");
};

export {
  createContestController,
  getContestController,
  updateContestController,
  deleteContestController,
};
