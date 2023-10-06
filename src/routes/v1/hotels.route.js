const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const hotelsController = require('../../controllers/hotels.controller');
const hotelsValidation = require('../../validations/hotels.validations');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(hotelsValidation.createHotels), hotelsController.createHotels)
  .get(auth(), hotelsController.getHotels);

router.route('/:hotelId').get(auth(), validate(hotelsValidation.getHotel), hotelsController.getHotel);

module.exports = router;
