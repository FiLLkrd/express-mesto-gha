const router = require('express').Router();
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

router.get('/', getUsers);

router.get('/me', getUserInfo);

router.get('/:userId', getUserByIdValid, getUserById);

router.patch('/me/avatar', updateUserAvatarValid, updateAvatar);

router.patch('/me', updateUserValid, updateUser);

module.exports = router;
