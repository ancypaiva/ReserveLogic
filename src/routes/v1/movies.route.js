const express = require('express');
const multer = require('multer');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const moviesController = require('../../controllers/movies.controller');
const moviesValidation = require('../../validations/movies.validation');

const router = express.Router();
const upload = multer();

router
  .route('/')
  .post(auth(), upload.any('File'), validate(moviesValidation.createMovies), moviesController.createMovies)
  .get(auth(), validate(moviesValidation.getMovies), moviesController.getMovies);

router.route('/imageupload').post(moviesController.postImageUpload);
router.route('/imageremove').post(moviesController.removeImageUpload);

router
  .route('/:movieId')
  .get(auth(), validate(moviesValidation.getMovie), moviesController.getMovie)
  .patch(auth(), upload.any('File'), validate(moviesValidation.updateMovies), moviesController.updateMovie)
  .delete(auth(), validate(moviesValidation.deleteMovies), moviesController.deleteMovie);

router.route('/:movieId/:fileIndex').delete(moviesController.deleteFile);

module.exports = router;
