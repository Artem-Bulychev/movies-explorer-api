module.exports = class ErrorUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
};
