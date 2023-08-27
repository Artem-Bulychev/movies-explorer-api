require('dotenv').config();

const URL = 'mongodb://127.0.0.1:27017/bitfilmsdb';
const { JWT_SECRET, NODE_ENV } = process.env;
const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports = {
  URL,
  JWT_SECRET,
  NODE_ENV,
  urlRegex,
};
