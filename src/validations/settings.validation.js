const Joi = require('joi');

const updateSettings = {
  params: Joi.object().keys({
    type: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      values: Joi.object().required(),
    })
    .min(1),
};

module.exports = {
  updateSettings,
};
