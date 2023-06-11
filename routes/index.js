const router = require('express').Router();
const ErrNotFound = require('../utils/ErrNotFound');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res, next) => {
  next(new ErrNotFound('Страница не найдена'));
});

module.exports = router;
