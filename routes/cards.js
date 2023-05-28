const router = require('express').Router();
const {
  getCards,
  createCard,
  removeCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', removeCard);
router.put('/cards/:cardId/likes', addCardLike);
router.delete('/cards/:cardId/likes', removeCardLike);

module.exports = router;
