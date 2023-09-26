const Movie = require('../models/movie');

const movieSchema = require('../models/movie');

const ErrorForbidden = require('../errors/ErrorForbidden');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErorrRequest = require('../errors/ErorrRequest');

function getMovies(req, res, next) {
  movieSchema
    .find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
}

function createMovie(req, res, next) {
  const owner = req.user._id;

  movieSchema
    .create({ ...req.body, owner })
    .then((movie) => res.status(201).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(
          new ErorrRequest('Переданы некорректные данные при создании фильма.'),
        );
      } else {
        next(error);
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
