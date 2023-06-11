const { UNAUTH_ERR } = require('./errors');

class ErrNotAuth extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTH_ERR;
  }
}

module.exports = ErrNotAuth;
