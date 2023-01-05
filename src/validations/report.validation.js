const Joi = require('joi');

const getReport = {
  params: Joi.object().keys({
    section: Joi.string(),
  }),
};

module.exports = {
  getReport,
};
