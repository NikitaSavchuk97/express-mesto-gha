const router = require('express').Router();

const { createUser, getUsers, getUserMe, getUserById, updateUserById, updateAvatarById } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUserMe);
router.get('/users/:userId', getUserById);

router.post('/users', createUser);

router.patch('/users/me', updateUserById);
router.patch('/users/me/avatar', updateAvatarById);

module.exports = router;
