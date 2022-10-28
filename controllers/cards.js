const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Некорректные данные: ${name} или ${link}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return res.status(403).send({ message: 'Пытаетесь удалить чужую карточку' })
      }
      return card.remove()
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Карточки с таким _id не существует' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
      }
    });
};

module.exports.likeCard = (req, res) => {
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
        res.status(400).send({ message: 'Карточки с таким _id не существует' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Карточки с таким _id не существует' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
