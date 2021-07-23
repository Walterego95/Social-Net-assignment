const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../../controllers/user-controller');

//GET all and POST all at /api/users...
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

//GET one, DELETE, and PUT at /api/users/:id...
router
  .route('/:id')
  .get(getUserById)
  .delete(deleteUser)
  .put(updateUser);

// api routes...
router
  .route('/:userId/friends/:friendsId')
  .post(addFriend)
  .delete(removeFriend);


module.exports = router;