const { BAD_REQUEST } = require('./errors');

class ErrBadRequest extends Error {
  constructor(message) {
    super(message);
    this.status = BAD_REQUEST;
  }
}

module.exports = ErrBadRequest;
