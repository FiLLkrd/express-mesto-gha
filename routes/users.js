const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

const {
  getUserByIdValid,
  updateUserValid,
  updateUserAvatarValid,
} = require('../middlewares/validation');

router.use(auth);

router.get('/users', getUsers);

router.get('/users/me', getUserInfo);

router.get('/users/:userId', getUserByIdValid, getUserById);

router.patch('/users/me/avatar', updateUserAvatarValid, updateAvatar);

router.patch('/users/me', updateUserValid, updateUser);

module.exports = router;
