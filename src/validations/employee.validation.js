const Joi = require('joi');
const { phoneNumber } = require('./custom.validation');

const createEmployee = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().required().custom(phoneNumber),
    designation: Joi.any().required(),
    role: Joi.string(),
    skills: Joi.any(),
    status: Joi.boolean().required(),
    permanent: Joi.boolean(),
  }),
};

const getEmployees = {
  query: Joi.object().keys({
    active: Joi.boolean(),
    sortBy: Joi.string(),
    searchBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    daterange: Joi.any(),
  }),
};

const getEmployee = {
  params: Joi.object().keys({
    employeeId: Joi.string(),
  }),
};

const updateEmployee = {
  params: Joi.object().keys({
    employeeId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      phone: Joi.string().required().custom(phoneNumber),
      designation: Joi.any().required(),
      role: Joi.string(),
      skills: Joi.any(),
      status: Joi.boolean().required(),
    })
    .min(1),
};

const deleteEmployee = {
  params: Joi.object().keys({
    employeeId: Joi.string(),
  }),
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
