/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const Card = require('../models/cards');
const ErrBadRequest = require('../utils/ErrBadRequest');
const ErrNotFound = require('../utils/ErrNotFound');
const ErrForBidden = require('../utils/ErrForBidden');
const {
  OK,
  CREATED,
} = require('../utils/errors');

const getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card
    .create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrBadRequest('Переданы некорректные данные для создания карточки'));
      } else {
        next(err);
      }
    });
};

const removeCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new ErrNotFound('Карточка с данным id не найдена');
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(card)
          .then(() => {
            res.status(OK).send(card);
          })
          .catch(next);
      } else {
        throw new ErrForBidden('Невозможно удалить карточку');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrForBidden('Переданы некорректные данные для удаления карточки'));
      } else {
        next(err);
      }
    });
};

const addCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrNotFound('Карточка с данным id не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrBadRequest('Переданы некорректные данные для установки лайка'));
      }
      return next(err);
    });
};

const removeCardLike = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new ErrNotFound('Карточка с данным id не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrBadRequest('Переданы некорректные данные для удаления лайка'));
      }
      return next(err);
    });
};

module.exports = {
  removeCard,
  removeCardLike,
  addCardLike,
  createCard,
  getCards,
};
