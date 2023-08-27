const Movie = require('../models/movie');

const ErrorForbidden = require('../errors/ErrorForbidden');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErorrRequest = require('../errors/ErorrRequest');

function getMovies(_, res, next) {
  Movie.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const { userId } = req.user;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: userId,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new ErorrRequest('Переданы некорректные данные при создании карточки'),
        );
      } else {
        next(err);
      }
    });
}

const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new ErrorNotFound('Данный фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ErrorForbidden('Недостаточно прав для удаления фильма');
      }
      Movie.deleteOne(movie)
        .then(() => res.status(200).send(movie))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new ErorrRequest('Некоректный запрос'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
