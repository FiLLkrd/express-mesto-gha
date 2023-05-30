const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK,
} = require('../utils/errors');
const usersModel = require('../models/users');

const getUsers = (req, res) => {
  usersModel.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  usersModel
    .findById(req.params.userId)
    .orFail()
    .then((users) => {
      res.send({ users });
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

const createUser = (req, res) => {
  usersModel
    .create(req.body)
    .then((users) => res.status(OK).send({ users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  usersModel
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
  usersModel
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
};
