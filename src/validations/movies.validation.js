const Joi = require('joi');

const getMovies = {
  query: Joi.object().keys({
    active: Joi.boolean(),
    sortBy: Joi.string(),
    searchBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    daterange: Joi.any(),
  }),
};

const createMovies = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    year: Joi.string().required(),
    others: Joi.string().required(),
    File: Joi.any(),
  }),
};

const getMovie = {
  params: Joi.object().keys({
    movieId: Joi.string(),
  }),
};

const updateMovies = {
  params: Joi.object().keys({
    movieId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
      year: Joi.string().required(),
      others: Joi.string().required(),
      File: Joi.any(),
    })
    .min(1),
};

const deleteMovies = {
  params: Joi.object().keys({
    movieId: Joi.string(),
  }),
};

module.exports = {
  getMovies,
  createMovies,
  getMovie,
  updateMovies,
  deleteMovies,
};
