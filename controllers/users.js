const User = require('../models/user');

module.exports.createUser = (req, res) => {
	const { name, about, avatar } = req.body;
	User.create({ name, about, avatar })
		.then((user) => res.send({ data: user }))
		.catch((err) => {
			if (err.name === 'ValidationError') {
				res.status(400).send({ message: 'Некорректные данные' });
			} else {
				res.status(500).send({ message: 'На сервере произошла ошибка' });
			}
		});
};

module.exports.getUsers = (req, res) => {
	User.find({})
		.then((user) => res.send({ data: user }))
		.catch((err) => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
	const { userId } = req.params;
	User.findById(userId)
		.then((user) => res.send({ data: user }))
		.catch((err) => {
			if (err.name === 'CastError') {
				res.status(404).send({ message: 'Пользователя с таким _id не существует' });
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
			new: true, // обработчик then получит на вход обновлённую запись
		},
	)
		.then((user) => res.send({ data: user }))
		.catch((err) => {
			console.log(err.name)
			if (err.name === 'ValidationError' || err.name === 'CastError') {
				res.status(400).send({ message: 'Некорректные данные для обновления информации' });
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
			new: true, // обработчик then получит на вход обновлённую запись
		},
	)
		.then((user) => res.send({ data: user }))
		.catch((err) => {
			console.log(err.name)
			if (err.name === 'ValidationError' || err.name === 'CastError') {
				res.status(400).send({ message: 'Некорректные данные для обновления аватара' });
			} else {
				res.status(500).send({ message: 'На сервере произошла ошибка' });
			}
		});
};
