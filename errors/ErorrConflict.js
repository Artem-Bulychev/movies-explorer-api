module.exports = class ErorrConflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
