// const httpStatus = require('http-status');
// const ApiError = require('../utils/ApiError');
const { Hotels } = require('../models');
const Displayfields = require('../config/displayfields');

const queryHotels = async (filter, options) => {
  // console.log(filter, 'ser fil');
  const hotels = await Hotels.paginate(filter, options);
  hotels.Displayfields = Displayfields.hotels;
  return hotels;
};

// const searchHotels = async (filter, options) => {
//   const query = [
//     {
//       $search: {
//         compound: {
//           should: [
//             {
//               text: {
//                 query: options.searchBy,
//                 path: 'name',
//                 score: {
//                   boost: {
//                     value: 6,
//                   },
//                 },
//                 fuzzy: {},
//               },
//             },
//             {
//               text: {
//                 query: options.searchBy,
//                 path: ['description', 'room_type', 'price'],
//                 fuzzy: {},
//               },
//             },
//           ],
//         },
//       },
//     },
//     {
//       $match: {
//         isDeleted: false,
//       },
//     },
//   ];
//   const hotels = await Hotels.aggregate(query)
//     .collation({ locale: 'en', strength: 2 })
//     .skip(options.limit * options.page - options.limit)
//     .limit(options.limit)
//     .exec();
//   const fullHotels = await Hotels.aggregate(query).exec();
//   const results = {
//     Displayfields: Displayfields.hotels,
//     limit: options.limit,
//     page: options.page,
//     results: hotels,
//     totalPages: Math.ceil(fullHotels.length / options.limit),
//     totalResults: fullHotels.length,
//   };
//   return results;
// };

const getHotelById = async (id) => {
  return Hotels.findById(id);
};

const createHotel = async (userBody) => {
  return Hotels.create(userBody);
};

module.exports = {
  queryHotels,
  getHotelById,
  createHotel,
};
