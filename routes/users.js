const router = require('express').Router();
const {
  createUser, getUsers, getUserById, updateUserById, updateAvatarById,
} = require('../controllers/users');

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUserById);
router.patch('/users/me/avatar', updateAvatarById);

module.exports = router;
