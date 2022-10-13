const User = require('../models/user')

module.exports.createUser = (req, res) => {
	const { name, about, avatar } = req.params;
	User.create({ name, about, avatar })
		.then((user) => res.send({ data: user }))
		.catch(() => {
			res.send({ message: 'На сервере произошла ошибка' });
		});
}
