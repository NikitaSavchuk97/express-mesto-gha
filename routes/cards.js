const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
  }),
}), createCard);

router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId', deleteCardById);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
