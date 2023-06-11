const { NOT_FOUND } = require('./errors');

class ErrNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

module.exports = ErrNotFound;
