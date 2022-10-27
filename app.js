// Здесь функциональность точки входа
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate } = require('celebrate');

const serverError = require('./middlewares/serverError');
const auth = require('./middlewares/auth');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { loginUser, createUser } = require('./controllers/users');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const validateUrl = (url) => {
	const regex = /^https?:\/\/(www\.)?[a-zA-Z\d]+\.[\w\-._~:?#[\]@!$&'()*+,;=]{2,}#?$/g;
	if (regex.test(url)) {
		return url;
	}
	throw new Error('Invalid url');
};

app.post('/signup', celebrate({
	body: Joi.object().keys({
		name: Joi.string().min(2).max(30),
		about: Joi.string().min(2).max(30),
		avatar: Joi.string().custom(validateUrl, 'custom validation'),
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6),
	})
}),
	createUser
);

app.post('/signin', celebrate({
	body: Joi.object().keys({
		name: Joi.string().min(2).max(30),
		about: Joi.string().min(2).max(30),
		avatar: Joi.string(),
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6),
	})
}),
	loginUser
);

app.use(auth);

app.use(routerUsers);
app.use(routerCards);

app.use(errors());
app.use(serverError);

// Если всё работает, консоль покажет, какой порт приложение слушает
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
