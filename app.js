const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64733a94b863768e38ac68e6',
  };

  next();
});

app.use(usersRouter);
app.use(cardsRouter);
app.use((req, res) => {
  res
    .status(404)
    .send({ message: 'Страница по этому адресу не найдена' });
});

mongoose.connect('mongodb://127.0.0.1/mestodb');

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
