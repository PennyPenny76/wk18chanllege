const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

const headCount = async () => {
  const numberOfUsers = await User.aggregate().count("userCount");
  return numberOfUsers;
};

const numberOfFriend = async (userId) =>
  User.aggregate([
    { $match: { _id: new ObjectId(userId) } },
    {
      $unwind: '$friends',
    },
    {
      $group: {
        _id: new ObjectId(userId),
        numberOfFriend: { $sum: 1 },
      },
    },
  ]);

module.exports = {
  
  async getUsers(req, res) {
    try {
      const users = await User.find();

      const userObj = {
        users,
        headCount: await headCount(),
      };

      res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({
        _id: req.params.userId,
      })
      .select("-__v")
      .populate('thoughts','friends');

      if (!userId) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json({
        user,
        numberOfFriend: await numberOfFriend(req.params.userId),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },


  // Delete a user and remove them from the thouthgt

  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({
        _id: req.params.userId,
      });

      if (!userId) {
        return res.status(404).json({ message: "No such user exists" });
      }

      const thought = await thought.findOneAndUpdate(
        { users: req.params.userId },
        { $pull: { users: req.params.userId } },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({
          message: "User deleted, but no thought found",
        });
      }

      res.json({ message: "User successfully deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add an assignment to a student
  async addAssignment(req, res) {
    console.log("You are adding an assignment");
    console.log(req.body);

    try {
      const student = await Student.findOneAndUpdate(
        { _id: req.params.studentId },
        { $addToSet: { assignments: req.body } },
        { runValidators: true, new: true }
      );

      if (!student) {
        return res
          .status(404)
          .json({ message: "No student found with that ID :(" });
      }

      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove assignment from a student
  async removeAssignment(req, res) {
    try {
      const student = await Student.findOneAndUpdate(
        { _id: req.params.studentId },
        { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
        { runValidators: true, new: true }
      );

      if (!student) {
        return res
          .status(404)
          .json({ message: "No student found with that ID :(" });
      }

      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
