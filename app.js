// Здесь функциональность точки входа
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '63484206febc3bded5346add' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(require('./routes/users'));
app.use(require('./routes/cards'));

app.use((req, res) => {
	res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

// Если всё работает, консоль покажет, какой порт приложение слушает
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
})

