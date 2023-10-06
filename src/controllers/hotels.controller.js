const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { hotelsService } = require('../services');
const { formatResponse } = require('../utils/commonUtils');

const createHotels = catchAsync(async (req, res) => {
  const insertUser = req.body;
  const user = await hotelsService.createHotel(insertUser);

  res.send(formatResponse(true, 200, 'create-hotel', { user }));
});

const getHotels = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['room_type']);
  const filterPrice = pick(req.query, ['price']);

  // console.log(filterPrice, 'filter');
  if (filter.room_type) {
    filter = {
      ...filter,
      'rooms.room_type': req.query.room_type, // Assuming your query parameter is named "room_type"
    };
  }
  if (filterPrice.price) {
    filter = {
      ...filter,
      'rooms.price': req.query.price, // Assuming your query parameter is named "room_type"
    };
  }
  // console.log(filter, 'con fil');
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'searchBy']);

  const result = await hotelsService.queryHotels(filter, options);
  res.send(formatResponse(true, 200, 'get-hotels', { result }));
});

const getHotel = catchAsync(async (req, res) => {
  const user = await hotelsService.getHotelById(req.params.hotelId);
  if (!user || user.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Hotel not found');
  }
  res.send(formatResponse(true, 200, 'get-hotel', { user }));
});

module.exports = {
  getHotels,
  createHotels,
  getHotel,
};
