/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const { isValidObjectId } = require('mongoose');
const cardsModel = require('../models/cards');

const getCards = (req, res) => {
  cardsModel
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
    .catch((err) => res.status(500).send({
      message: 'На сервере произошла ошибка',
      err: err.message,
      stack: err.stack,
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardsModel.create({ name, link, owner })
    .then(({
      _id,
      name,
      link,
      owner,
      likes,
    }) => res.status(201).send({
      _id,
      name,
      link,
      owner,
      likes,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(500).send({
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
    return res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки' });
  }
  cardsModel.deleteOne({ _id: cardId })
    .then(({ deletedCount }) => {
      if (!deletedCount) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const addCardLike = (req, res) => {
  cardsModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(400).send({ message: 'Передан несуществующий _id карточки' });
      }
      res.status(201).send(card.likes);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const removeCardLike = (req, res) => {
  cardsModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(400).send({ message: 'Передан несуществующий _id карточки' });
      }
      res.status(200).send(card.likes);
    })
    .catch((err) => {
      res.status(500).send({
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
