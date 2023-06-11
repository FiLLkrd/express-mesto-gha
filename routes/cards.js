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

router.get('/cards', getCards);

router.post('/cards', createCardValid, createCard);

router.delete('/cards/:cardId', cardIdValid, removeCard);

router.put('/cards/:cardId/likes', cardIdValid, addCardLike);

router.delete('/cards/:cardId/likes', cardIdValid, removeCardLike);

module.exports = router;
