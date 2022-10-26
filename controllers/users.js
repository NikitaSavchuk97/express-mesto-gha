const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { celebrate, Joi } = require('celebrate');
const User = require('../models/user');



module.exports.loginUserValidation = celebrate({
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6),
	})
});

module.exports.loginUser = (req, res, next) => {
	const { email, password } = req.body;
	return User.findUserByCredentials({ email, password })
		.then((user) => {
			const token = jwt.sign(
				{ _id: user._id },
				"yandex",
				{ expiresIn: 3600 },
			)
			res.cookie(
				'jwt',
				token,
				{ maxAge: 3600000 * 24 * 7 },
			)
				.end('Работает!')
		})
		.catch(next);
};



module.exports.createUserValidation = celebrate({
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6),
	})
});

module.exports.createUser = (req, res, next) => {
	const { name, about, avatar, email, password } = req.body;
	bcrypt
		.hash(password, 10)
		.then((hash) => User.create({ name, about, avatar, email, password: hash }))
		.then((user) => res.status(201).send({
			name: user.name,
			about: user.about,
			avatar: user.avatar,
			email: user.email,
		}))
		.catch((err) => {
			if (err.code === 11000) {
				next(new Error("Пользователь с таким email уже существует"));
			} else if (err.name === 'ValidationError') {
				next(new Error("Некорректные данные"));
			} else {
				next(err);
			}
		})
};



module.exports.getUsers = (req, res, next) => {
	User.find({})
		.then((users) => res.send(users))
		.catch(next);
};

module.exports.getUserMe = (req, res, next) => {
	User.findById(req.user._id)
		.orFail(() => {
			throw new NotFound("Пользователь не найден");
		})
		.then((user) => res.status(200).send({ user }))
		.catch((err) => {
			if (err.name === "CastError") {
				throw new BadRequest("Переданы некорректные данные");
			} else if (err.message === "NotFound") {
				throw new NotFound("Пользователь не найден");
			}
		})
		.catch(next);
};

module.exports.getUserById = (req, res) => {
	const { userId } = req.params;
	User.findById(userId)
		.orFail(() => new Error('NotFound'))
		.then((user) => res.send({ data: user }))
		.catch((err) => {
			if (err.name === 'CastError') {
				res.status(400).send({ message: 'Переданы некорректные данные' });
			} else if (err.message === 'NotFound') {
				res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
			} else {
				res.status(500).send({ message: 'На сервере произошла ошибка' });
			}
		});
};

module.exports.updateUserById = (req, res) => {
	const owner = req.user._id;
	const { name, about } = req.body;
	User.findByIdAndUpdate(
		owner,
		{
			name,
			about,
		},
		{
			new: true,
			runValidators: true,
		},
	)
		.orFail(() => new Error('NotFound'))
		.then((user) => res.send({ data: user }))
		.catch((err) => {
			if (err.name === 'ValidationError' || err.name === 'CastError') {
				res.status(400).send({ message: 'Некорректные данные для обновления информации' });
			} else if (err.message === 'NotFound') {
				res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
			} else {
				res.status(500).send({ message: 'На сервере произошла ошибка' });
			}
		});
};

module.exports.updateAvatarById = (req, res) => {
	const owner = req.user._id;
	const { avatar } = req.body;
	User.findByIdAndUpdate(
		owner,
		{
			avatar,
		},
		{
			new: true,
			runValidators: true,
		},
	)
		.then((user) => res.send({ data: user }))
		.catch((err) => {
			if (err.name === 'ValidationError' || err.name === 'CastError') {
				res.status(400).send({ message: 'Некорректные данные для обновления аватара' });
			} else {
				res.status(500).send({ message: 'На сервере произошла ошибка' });
			}
		});
};