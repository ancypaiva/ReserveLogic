const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Movies } = require('../models');
const Displayfields = require('../config/displayfields');

const queryMovies = async (filter, options) => {
  const movies = await Movies.paginate(filter, options);
  movies.Displayfields = Displayfields.movies;
  return movies;
};

const searchMovies = async (filter, options) => {
  const query = [
    {
      $search: {
        compound: {
          should: [
            {
              text: {
                query: options.searchBy,
                path: 'name',
                score: {
                  boost: {
                    value: 6,
                  },
                },
                fuzzy: {},
              },
            },
            {
              text: {
                query: options.searchBy,
                path: ['description', 'year', 'others'],
                fuzzy: {},
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isDeleted: false,
      },
    },
  ];
  const movies = await Movies.aggregate(query)
    .collation({ locale: 'en', strength: 2 })
    .skip(options.limit * options.page - options.limit)
    .limit(options.limit)
    .exec();
  const fullMovies = await Movies.aggregate(query).exec();
  const results = {
    Displayfields: Displayfields.movies,
    limit: options.limit,
    page: options.page,
    results: movies,
    totalPages: Math.ceil(fullMovies.length / options.limit),
    totalResults: fullMovies.length,
  };
  return results;
};

const getMovieById = async (id) => {
  return Movies.findById(id);
};

const updateMovieById = async (userId, updateBody) => {
  const user = await getMovieById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteMovieById = async (userId) => {
  const user = await getMovieById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.isDeleted = true;
  user.save();
  return user;
};

const createMovie = async (userBody) => {
  return Movies.create(userBody);
};

const removeFile = async (userId, fileIndex) => {
  const user = await getMovieById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.files.length === 1) {
    user.files = undefined;
  } else {
    user.files.splice(fileIndex, 1);
  }
  const updateUser = await updateMovieById(userId, {
    files: user.files,
  });
  return updateUser;
};

module.exports = {
  queryMovies,
  searchMovies,
  getMovieById,
  updateMovieById,
  deleteMovieById,
  createMovie,
  removeFile,
};
