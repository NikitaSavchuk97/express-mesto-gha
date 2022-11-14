const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateUrl } = require('../middlewares/validations');
const { loginUser, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/notFoundError');
const auth = require('../middlewares/auth');
const routerUsers = require('./users');
const routerCards = require('./cards');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateUrl, 'custom validation'),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  loginUser,
);

router.use(auth);
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

router.use(routerUsers);
router.use(routerCards);

router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не существует'));
});

module.exports = router;
