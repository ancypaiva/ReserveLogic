const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const crudController = require('../../controllers/crud.controller');

const sendemailController = require('../../controllers/sendemail.controller');

const router = express.Router();

router.route('/usertestemail').post(sendemailController.sendEmailControl);

router.route('/pushnotfication').post(sendemailController.sendPushnotification);

router
  .route('/')
  .post(auth(), validate(userValidation.createUser), crudController.createEntries)
  .get(auth(''), validate(userValidation.getUsers), crudController.getUsers);

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getUser), crudController.getUser)
  .patch(auth(), validate(userValidation.updateUser), crudController.updateUser)
  .delete(auth(), validate(userValidation.deleteUser), crudController.deleteUser);

module.exports = router;
