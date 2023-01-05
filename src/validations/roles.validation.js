const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    permissions: Joi.any().required(),
  }),
};

const getRoles = {
  query: Joi.object().keys({
    active: Joi.boolean(),
    sortBy: Joi.string(),
    searchBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRole = {
  params: Joi.object().keys({
    RoleId: Joi.string().custom(objectId),
  }),
};

const updateRole = {
  params: Joi.object().keys({
    RoleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      permissions: Joi.any().required(),
    })
    .min(1),
};

const deleteRole = {
  params: Joi.object().keys({
    RoleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
};
