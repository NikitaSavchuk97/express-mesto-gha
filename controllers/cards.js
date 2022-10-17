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
		.catch((err) => res.status(500).send({ message: 'На сервере произошла ошибка' }));
}

module.exports.deleteCardById = (req, res) => {
	const { cardId } = req.params;
	Card.findByIdAndRemove(cardId)
		.orFail(() => new Error('NotFound'))
		.then(card => res.send({ data: card }))
		.catch((err) => {
			if (err.name === 'CastError') {
				res.status(400).send({ message: 'Карточки с таким _id не существует' });
			} else if (err.message === 'NotFound') {
				res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
			} else {
				res.status(500).send({ message: 'На сервере произошла ошибка' });
			}
		});
}

module.exports.likeCard = (req, res) => {
	Card.findByIdAndUpdate(
		req.params.cardId,
		{
			$addToSet:
			{
				likes: req.user._id
			}
		},
		{
			new: true
		},
	)
		.orFail(() => new Error('NotFound'))
		.then(card => res.send({ data: card }))
		.catch((err) => {
			if (err.name === 'CastError') {
				res.status(400).send({ message: 'Карточки с таким _id не существует' });
			} else if (err.message === 'NotFound') {
				res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
			} else {
				res.status(500).send({ message: 'На сервере произошла ошибка' });
			}
		})
}

module.exports.dislikeCard = (req, res) => {
	Card.findByIdAndUpdate(
		req.params.cardId,
		{
			$pull:
			{
				likes: req.user._id
			}
		},
		{
			new: true
		},
	)
		.orFail(() => new Error('NotFound'))
		.then(card => res.send({ data: card }))
		.catch((err) => {
			if (err.name === 'CastError') {
				res.status(400).send({ message: 'Карточки с таким _id не существует' });
			} else if (err.message === 'NotFound') {
				res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
			} else {
				res.status(500).send({ message: 'На сервере произошла ошибка' });
			}
		})
}
