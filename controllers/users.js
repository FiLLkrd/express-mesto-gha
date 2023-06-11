const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { ErrConflictUser, ErrBadRequest } = require('../utils/ErrConflictUser');
const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK,
} = require('../utils/errors');

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { id: user._id },
          'super-strong-secret',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch((err) => {
      res.status(BAD_REQUEST).send({ message: err.message });
    });
};

const getUserInfo = (req, res) => {
  const userId = req.user._id;
  User
    .findById(userId)
    .orFail()
    .then((users) => {
      res.status(OK).send({ users });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
          err: err.message,
          stack: err.stack,
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User
    .findById(userId)
    .orFail()
    .then((users) => {
      res.status(OK).send({ users });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
          err: err.message,
          stack: err.stack,
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
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
      .then(() => res.status(201).send(
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
          message: 'переданы некорректные данные в методы обновления пользователя или профиля',
          err: err.message,
          stack: err.stack,
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
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
          err: err.message,
          stack: err.stack,
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
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
