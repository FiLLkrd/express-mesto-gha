const express = require('express');
const mongoose = require('mongoose');
const { Joi, celebrate } = require('celebrate');
const router = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { createUserValid } = require('./middlewares/validation');

const app = express();

mongoose.connect('mongodb://127.0.0.1/mestodb');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', createUserValid, createUser);
app.use(auth);
app.use('/', router);

app.use((req, res) => {
  res
    .status(404)
    .send({ message: 'Страница по этому адресу не найдена' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
