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



const cardSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 30,
	},
	link: {
		type: String,
		required: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	likes: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'user',
			},
		],
		default: [],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	}
});

module.exports = mongoose.model('card', cardSchema);

app.use(require('./routes/users'));

app.use((req, res) => {
	res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

// Если всё работает, консоль покажет, какой порт приложение слушает
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`)
})

