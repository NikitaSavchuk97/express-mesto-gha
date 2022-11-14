const Card = require('../models/card');

const BadRequestError400 = require('../errors/badRequestError');
const NotFoundError404 = require('../errors/notFoundError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError400(`Некорректные данные: ${name} или ${link}`));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return res.status(403).send({ message: 'Пытаетесь удалить чужую карточку' });
      }
      return card.remove()
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400('Карточки с таким _id не существует'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError404('Карточка по указанному _id не найден'));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400('Карточки с таким _id не существует'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError404('Карточка по указанному _id не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400('Карточки с таким _id не существует'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError404('Карточка по указанному _id не найдена'));
      } else {
        next(err);
      }
    });
};
