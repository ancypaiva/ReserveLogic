const express = require('express');
const multer = require('multer');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const hotelsController = require('../../controllers/hotels.controller');
const hotelsValidation = require('../../validations/hotels.validations');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router
  .route('/')
  .post(auth(), upload.any('File'), validate(hotelsValidation.createHotels), hotelsController.createHotels)
  .get(auth(), hotelsController.getHotels);

router.route('/:hotelId').get(auth(), validate(hotelsValidation.getHotel), hotelsController.getHotel);

module.exports = router;
