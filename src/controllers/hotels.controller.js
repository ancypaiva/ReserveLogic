const httpStatus = require('http-status');
const fs = require('fs/promises');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { hotelsService } = require('../services');
const { formatResponse } = require('../utils/commonUtils');

const createHotels = catchAsync(async (req, res) => {
  const insertUser = req.body;
  const uploadFiles = [];
  let uploadStatus = false;
  let uploadReq = false;
  const image = [];
  if (req.files) {
    uploadReq = true;
    // save upload files to local storage asynchronously
    await Promise.all(
      req.files.map(async (uploadedFile) => {
        const filePath = `uploads/${uploadedFile.originalname}`;
        // renaming to move the file asynchronously
        await fs.rename(uploadedFile.path, filePath);
        uploadFiles.push({ path: filePath });
        image.push(uploadedFile.originalname);
      })
    );
    uploadStatus = true;
  }
  if (uploadReq && uploadStatus) {
    insertUser.image = image;
  }
  const user = await hotelsService.createHotel(insertUser);

  res.send(formatResponse(true, 200, 'create-hotel', { user }));
});

const getHotels = catchAsync(async (req, res) => {
  const filter = {};

  const allowedFilters = ['room_type', 'price', 'amenities'];

  // for (const name of allowedFilters) {
  //   if (req.query[name]) {
  //     if (name === 'room_type') {
  //       filter['rooms.room_type'] = req.query[name];
  //     } else if (name === 'price') {
  //       const priceRange = req.query[name].split('-');
  //       if (priceRange.length === 2) {
  //         filter['rooms.price'] = {
  //           $gte: parseInt(priceRange[0]),
  //           $lte: parseInt(priceRange[1]),
  //         };
  //       }
  //     } else if (name === 'amenities') {
  //       filter['rooms.amenities'] = req.query[name];
  //     }
  //   }
  // }
  allowedFilters.forEach((name) => {
    if (req.query[name]) {
      if (name === 'room_type') {
        filter['rooms.room_type'] = req.query[name];
      } else if (name === 'price') {
        const priceRange = req.query[name].split('-');
        if (priceRange.length === 2) {
          filter['rooms.price'] = {
            $gte: parseInt(priceRange[0], 10), // Specify the radix parameter
            $lte: parseInt(priceRange[1], 10), // Specify the radix parameter
          };
        }
      } else if (name === 'amenities') {
        filter['rooms.amenities'] = req.query[name];
      }
    }
  });

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
