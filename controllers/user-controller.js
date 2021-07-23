const { User, Thought } = require('../models');

//methods for user functions...
const userController = {

  //get all users...
  getAllUsers(req, res) {
    User.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //get single user by id and thoughts/friends data...
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => {
        //404 error...
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //create new user...
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },


  //update user info by id, also add runValidators...
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  //delete user by id...
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        User.updateMany(
          {
            _id: { $in: dbUserData.friends }
          },
          {
            $pull: { friends: params.id }
          }
        )
          .then(() => {
            //delete any thoughts the user has...
            Thought.deleteMany(
              {
                username: dbUserData.username
              }
            )
              .then(response => {
                console.log(response);
                res.json({ message: 'User deleted successfully!' })
              })
              .catch(err => res.status(404).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  },

  //add friends to user list...
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendsId } },
      { new: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json(err);
      });
  },


  //delete friends from friend list...
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendsId } },
      { new: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json(err);
      });
  }
};

module.exports = userController;