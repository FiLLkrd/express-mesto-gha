const jwt = require('jsonwebtoken');
const ErrNotAuth = require('../utils/ErrNotAuth');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrNotAuth('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return next(new ErrNotAuth('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
