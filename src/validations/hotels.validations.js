const Joi = require('joi');

const getHotels = {
  query: Joi.object().keys({
    room_type: Joi.string(),
    sortBy: Joi.string(),
    searchBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    daterange: Joi.any(),
  }),
};

const createHotels = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    rooms: Joi.array()
      .items(
        Joi.object().keys({
          room_type: Joi.string().required(),
          price: Joi.number().required(),
          amenities: Joi.array(),
        })
      )
      .required(),
  }),
};

const getHotel = {
  params: Joi.object().keys({
    hotelId: Joi.string(),
  }),
};

module.exports = {
  getHotels,
  createHotels,
  getHotel,
};
