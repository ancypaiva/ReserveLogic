const Joi = require('joi');

const getNotifications = {
  query: Joi.object().keys({
    active: Joi.boolean(),
    sortBy: Joi.string(),
    searchBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    daterange: Joi.any(),
  }),
};

module.exports = {
  getNotifications,
};
