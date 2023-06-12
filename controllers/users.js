const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const ErrConflictUser = require('../utils/ErrConflictUser');
const ErrBadRequest = require('../utils/ErrBadRequest');
const ErrNotAuth = require('../utils/ErrNotAuth');
const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK,
} = require('../utils/errors');
const ErrNotFound = require('../utils/ErrNotFound');

const getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.send({ data });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User
    .findById(userId)
    .then((user) => {
      if (!user) {
        throw new ErrNotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrBadRequest('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'переданы некорректные данные',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'переданы некорректные данные в методы обновления аватара',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const getUserInfo = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ErrNotFound('Пользователь не найден');
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(ErrBadRequest('Переданы некорректные данные'));
      } else if (err.message === 'Not Found') {
        next(new ErrNotFound('Пользователь не найден'));
      } else next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrNotAuth('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((mathed) => {
          if (!mathed) {
            return Promise.reject(new ErrNotAuth('Неправильные почта или пароль'));
          }
          return res.send({
            token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
          });
        });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User
      .create({
        name, about, avatar, email, password: hash,
      })
      .then(() => res.status(OK).send(
        {
          data: {
            name, about, avatar, email,
          },
        },
      ))
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (err.name === 'MongoServerError') {
          return next(new ErrConflictUser('Пользователь с таким email уже существует'));
        }
        if (err.name === 'ValidationError') {
          return next(new ErrBadRequest('переданы некорректные данные в метод'));
        }
        next(err);
      });
  })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};
