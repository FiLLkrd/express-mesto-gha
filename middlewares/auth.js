const jwt = require('jsonwebtoken');
const { BAD_REQUEST } = require('../utils/errors');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.starWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return res.status(BAD_REQUEST).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
