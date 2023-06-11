const { CONFLICT } = require('./errors');

class ErrConflictUser extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

module.exports = ErrConflictUser;
