// Здесь функциональность точки входа
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { loginUser, loginUserValidation, createUser, createUserValidation } = require('./controllers/users')


// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginUserValidation, loginUser);
app.use(auth);
app.use(require('./routes/users'));
app.use(errors());

// Если всё работает, консоль покажет, какой порт приложение слушает
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
