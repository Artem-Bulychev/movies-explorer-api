module.exports = class ErorrRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
};
