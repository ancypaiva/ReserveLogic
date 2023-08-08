const amazonS3 = require('@armiasystems/s3-upload');
const logger = require('../config/logger');
const { notificationService, moviesService } = require('../services');
const { tokenService, postmarkService } = require('../services');

const settings = {
  accessKeyID: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
  s3bucket: process.env.S3_BUCKET,
  folderName: process.env.S3_FOLDER,
};

const saveNotification = (Job) => {
  try {
    notificationService.createNotification(Job.data);
  } catch (error) {
    logger.info('Worker error - Create notification : ', error);
  }
};

const sendSignUpEmail = async (Job) => {
  try {
    // Send email
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(Job.data);
    await postmarkService.sendVerificationEmail(Job.data.email, verifyEmailToken);
  } catch (error) {
    logger.info('Worker error - Send signup email : ', error);
  }
};

const uploadImagetoS3 = async (Job) => {
  try {
    const uploadsFiles = [];
    let uploadStatus = false;
    let uploadReq = false;
    const imageObject = {};
    if (Job.data.files) {
      uploadReq = true;
      await amazonS3
        .uploadFile(Job.data.files, settings)
        .then((filesUploads) => {
          // eslint-disable-next-line func-names
          filesUploads.forEach(function (upload) {
            uploadsFiles.push({ path: upload.Location });
          });
          uploadStatus = true;
        })
        // eslint-disable-next-line func-names
        .catch(function (error) {
          logger.info('Error iploading image to S3 : ', error);
        });
    }
    if (uploadReq && uploadStatus) {
      imageObject.files = uploadsFiles;
    }

    logger.info('Image obj :::::: ', imageObject);
    await moviesService.updateMovieById(Job.movieId, imageObject);
  } catch (error) {
    logger.info('Worker error - Upload image to S3 : ', error);
  }
};

module.exports = {
  saveNotification,
  sendSignUpEmail,
  uploadImagetoS3,
};
