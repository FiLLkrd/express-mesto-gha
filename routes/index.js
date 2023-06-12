const router = require('express').Router();
const auth = require('../middlewares/auth');
const ErrNotFound = require('../utils/ErrNotFound');
const { login, createUser } = require('../controllers/users');
const { createUserValid, loginValid } = require('../middlewares/validation');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use(auth);
router.post('/signin', loginValid, login);
router.post('/signup', createUserValid, createUser);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res, next) => {
  next(new ErrNotFound('Страница не найдена'));
});

module.exports = router;
