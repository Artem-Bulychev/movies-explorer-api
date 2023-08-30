require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const ErrorUnauthorized = require('../errors/ErrorUnauthorized');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErorrConflict = require('../errors/ErorrConflict');
const ErorrRequest = require('../errors/ErorrRequest');

function getUsers(req, res, next) {
  User.findById(req.user._id)
    .orFail(() => next(new ErrorNotFound('Пользователь по указанному id не найден')))
    .then((user) => res.send(user))
    .catch(next);
}

function createUser(req, res, next) {
  const {
    email, password, name,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      const { _id } = user;

      return res.status(201).send({
        email,
        name,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ErorrConflict(
            'Пользователь с таким электронным адресом уже зарегистрирован',
          ),
        );
      } else if (err.name === 'ValidationError') {
        next(
          new ErorrRequest(
            'Переданы некорректные данные при регистрации пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
}

function updateUser(req, res, next) {
  const { name, email } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send(user);

      throw new ErrorNotFound('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new ErorrRequest(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign(
          { userId },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        );

        return res.send({ token });
      }

      throw new ErrorUnauthorized('Неправильные почта или пароль');
    })
    .catch(next);
}

module.exports = {
  createUser,
  login,
  getUsers,
  updateUser,
};
