const { FORBIDDEN } = require('./errors');

class ErrForBidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

module.exports = ErrForBidden;
