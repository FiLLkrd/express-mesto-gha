const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const { createUserValid, loginValid } = require('./middlewares/validation');
const ErrNotFound = require('./utils/ErrNotFound');

const app = express();

app.use(express.json());

app.post('/signin', loginValid, login);
app.post('/signup', createUserValid, createUser);

app.use(router);
app.use((req, res, next) => {
  next(new ErrNotFound('Страница по данному адресу не найдена'));
});
mongoose.connect('mongodb://127.0.0.1/mestodb');
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
