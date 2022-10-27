// Здесь функциональность точки входа
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const serverError = require('./middlewares/serverError')
const auth = require('./middlewares/auth');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const {
	loginUser, loginUserValidation, createUser, createUserValidation,
} = require('./controllers/users');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginUserValidation, loginUser);

app.use(auth);

app.use(routerUsers);
app.use(routerCards);

app.use(errors());
app.use(serverError);

// Если всё работает, консоль покажет, какой порт приложение слушает
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
