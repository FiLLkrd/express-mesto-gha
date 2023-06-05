/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const { isValidObjectId } = require('mongoose');
const Cards = require('../models/cards');
const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK,
  CREATED,
} = require('../utils/errors');

const getCards = (req, res) => {
  Cards
    .find({})
    .then((cards) => res.send(cards.map(({
      _id,
      name,
      link,
      owner,
      likes,
    }) => ({
      _id,
      name,
      link,
      owner,
      likes,
    }))))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({
      message: 'На сервере произошла ошибка',
      err: err.message,
      stack: err.stack,
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Cards.create({ name, link, owner })
    .then(({
      _id,
      name,
      link,
      owner,
      likes,
    }) => res.status(CREATED).send({
      _id,
      name,
      link,
      owner,
      likes,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const removeCard = (req, res) => {
  const { cardId } = req.params;

  if (!isValidObjectId(cardId)) {
    return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления карточки' });
  }
  Cards.deleteOne({ _id: cardId })
    .then(({ deletedCount }) => {
      if (!deletedCount) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(OK).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const addCardLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(cardId)) {
    return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
  }

  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      res.status(CREATED).send(card.likes);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const removeCardLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(cardId)) {
    return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка' });
  }

  Cards.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      res.status(OK).send(card.likes);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  removeCard,
  removeCardLike,
  addCardLike,
  createCard,
  getCards,
};
