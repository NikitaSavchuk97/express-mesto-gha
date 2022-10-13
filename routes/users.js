const router = require('express').Router();
const { createUser } = require('../controllers/users');

router.post('/users', createUser); // создать юзера

module.exports = router;