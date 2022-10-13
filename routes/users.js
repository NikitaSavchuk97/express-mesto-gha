const router = require('express').Router();
const { createUser } = require('../controllers/users');

router.post('/users', createUser);

module.exports = router;