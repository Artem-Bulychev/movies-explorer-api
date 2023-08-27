const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

require('../utils/constants');

const cardSchema = new Schema(
  {
    country: {
      type: String,
      required: true,
    },

    director: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
      validate: {
        validator: (i) => validator.isURL(i),
        message: 'Введите корректную ссылку',
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (i) => validator.isURL(i),
        message: 'Введите корректную ссылку',
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (i) => validator.isURL(i),
        message: 'Введите корректную ссылку',
      },
    },
    owner: {
      type: mongoose.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: Number,
      required: true,
    },
    nameEN: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
