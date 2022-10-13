const User = require('../models/user')

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
}
