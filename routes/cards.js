const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const patternValid = require('../utils/patternValid');
const auth = require('../middlewares/auth');
const {
  getCards,
  createCard,
  removeCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/cards');

router.get('/cards', auth, getCards);

router.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(patternValid),
  }),
}), createCard);

router.delete('/cards/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), removeCard);

router.put('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), addCardLike);

router.delete('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), removeCardLike);

module.exports = router;
