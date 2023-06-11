const http2 = require('http2');

const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;
const INTERNAL_SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;
const CONFLICT = http2.constants.HTTP_STATUS_CONFLICT;
const UNAUTH_ERR = http2.constants.HTTP_STATUS_UNAUTHORIZED;
const FORBIDDEN = http2.constants.HTTP_STATUS_FORBIDDEN;

module.exports = {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK,
  CREATED,
  UNAUTH_ERR,
  FORBIDDEN,
  CONFLICT,
};
