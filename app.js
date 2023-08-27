/* eslint-disable import/no-extraneous-dependencies */
// Подключаем dotenv
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const limiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes/index');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

const { URL } = require('./utils/constants');

const { PORT = 3000 } = process.env;

app.use(cors());

mongoose.set('strictQuery', true);

mongoose.connect(URL)
  .then(() => {
    console.log('БД успешно подключена');
  })
  .catch(() => {
    console.log('Не удалось подключиться к БД');
  });

app.use(helmet());

app.use(express.json());

app.use(requestLogger); // подключаем логгер запросов

app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});