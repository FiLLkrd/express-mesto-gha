const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const ErrNotFound = require('./utils/ErrNotFound');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);
app.use(router);

app.use(errorLogger);
app.use((req, res, next) => {
  next(new ErrNotFound('Страница по данному адресу не найдена'));
});
mongoose.connect('mongodb://127.0.0.1/mestodb');
app.use(errors());
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
