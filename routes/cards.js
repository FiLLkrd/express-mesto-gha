const router = require('express').Router();
const {
  getCards,
  createCard,
  removeCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/cards');

const {
  createCardValid,
  cardIdValid,
} = require('../middlewares/validation');

router.get('/', getCards);

router.post('/', createCardValid, createCard);

router.delete('/:cardId', cardIdValid, removeCard);

router.put('/:cardId/likes', cardIdValid, addCardLike);

router.delete('/:cardId/likes', cardIdValid, removeCardLike);

module.exports = router;
