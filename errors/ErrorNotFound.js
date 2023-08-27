module.exports = class ErrorNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
};
