const userController = {
  getUser: (req, res) => {
    res.status(200).json({ message: "User details fetched successfully" });
  },

  updateUser: (req, res) => {},
  deleteUser: (req, res) => {},
};

module.exports = userController;
