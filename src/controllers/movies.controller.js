/* eslint-disable no-underscore-dangle */
const httpStatus = require('http-status');
const multer = require('multer');
const amazonS3 = require('@armiasystems/s3-upload');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { moviesService } = require('../services');
const { formatResponse } = require('../utils/commonUtils');
const { subscribeToNotificationQueue } = require('../utils/redisQueueProducer');

const storage = multer.memoryStorage({
  destination(_req, _file, callback) {
    callback(null, '');
  },
});

const settings = {
  accessKeyID: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
  s3bucket: process.env.S3_BUCKET,
  folderName: process.env.S3_FOLDER,
};

const createMovies = catchAsync(async (req, res) => {
  const insertUser = req.body;
  const uploadsFiles = [];
  let uploadStatus = false;
  let uploadReq = false;
  if (req.files) {
    uploadReq = true;
    await amazonS3
      .uploadFile(req.files, settings)
      .then((filesUploads) => {
        filesUploads.forEach(function (upload) {
          uploadsFiles.push({ path: upload.Location });
        });
        uploadStatus = true;
      })
      .catch(function (error) {
        return res.json({ success: false, msg: error });
      });
  }
  if (uploadReq && uploadStatus) {
    insertUser.files = uploadsFiles;
  }
  const user = await moviesService.createMovie(insertUser);

  // Create new notification
  const notification = {
    user_id: req.user.id,
    type: 'movies',
    type_id: user._id,
    message: `Movie ${insertUser.name} is created successfully.`,
  };
  subscribeToNotificationQueue(notification);

  res.send(formatResponse(true, 200, 'create-movie', { user }));
});

const getMovies = catchAsync(async (req, res) => {
  const daterange = pick(req.query, ['daterange']);
  const filter = pick(req.query, ['active']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'searchBy']);
  if (Object.keys(daterange).length) {
    const dateranges = JSON.parse(daterange.daterange);
    const fromDate = new Date(dateranges.startDate);
    const toDate = new Date(dateranges.endDate);
    filter.createdAt = { $lte: toDate, $gte: fromDate };
  }
  if (options.searchBy && options.searchBy.length > 0) {
    const result = await moviesService.searchMovies(filter, options);
    res.send(formatResponse(true, 200, 'get-movies', { result }));
  } else {
    const result = await moviesService.queryMovies(filter, options);
    res.send(formatResponse(true, 200, 'list-employees', { result }));
  }
});

const getMovie = catchAsync(async (req, res) => {
  const user = await moviesService.getMovieById(req.params.movieId);
  if (!user || user.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Movie not found');
  }
  res.send(formatResponse(true, 200, 'get-movie', { user }));
});

const updateMovie = catchAsync(async (req, res) => {
  const oldData = await moviesService.getMovieById(req.params.movieId);
  const oldFiles = oldData.files ? oldData.files : [];
  const insertUser = req.body;
  const uploadsFiles = [];
  let uploadStatus = false;
  let uploadReq = false;
  if (req.files) {
    uploadReq = true;
    await amazonS3
      .uploadFile(req.files, settings)
      .then((filesUploads) => {
        filesUploads.forEach(function (upload) {
          uploadsFiles.push({ path: upload.Location });
        });
        uploadStatus = true;
      })
      .catch(function (error) {
        return res.json({ success: false, msg: error });
      });
  }
  if (uploadStatus && uploadReq) {
    insertUser.files = [...oldFiles, ...uploadsFiles];
  }
  const user = await moviesService.updateMovieById(req.params.movieId, req.body);
  res.send(formatResponse(true, 200, 'update-movie', { user }));
});

const deleteMovie = catchAsync(async (req, res) => {
  await moviesService.deleteMovieById(req.params.movieId);
  res.send({ sucess: true, code: 200, msg: 'Deleted Sucessfully' });
});

const postImageUpload = catchAsync(async (req, res) => {
  const upload = multer({ storage }).any();
  upload(req, res, async function (err) {
    if (err) return res.json({ success: false, msg: 'Error uploading file..' });
    let uploadsFiles = {};
    let uploadStatus = false;
    await amazonS3
      .uploadFile(req.files, settings)
      .then((filesUploads) => {
        uploadsFiles = filesUploads;
        uploadStatus = true;
      })
      .catch(function (error) {
        return res.json({ success: false, msg: error });
      });
    if (uploadStatus) {
      const user = req.body.Userid;
      if (!user) {
        throw new Error();
      }
      await moviesService.updateMovieById(user, {
        image: uploadsFiles[0].Location,
      });

      return res.send(formatResponse(true, 200, 'file-upload', { location: uploadsFiles[0].Location }));
    }
    return res.json({ success: false, msg: 'Error uploading file..' });
  });
});

const removeImageUpload = catchAsync(async (req, res) => {
  const user = req.body.userid;
  if (!user) {
    throw new Error();
  } else {
    await moviesService.updateMovieById(user, {
      image: req.body.image,
    });

    return res.send(formatResponse(true, 200, 'remove-upload', { location: req.body.image }));
  }
});

const deleteFile = catchAsync(async (req, res) => {
  const user = await moviesService.removeFile(req.params.movieId, req.params.fileIndex);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(formatResponse(true, 200, 'delete-file', { user }));
});

module.exports = {
  getMovies,
  createMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  postImageUpload,
  removeImageUpload,
  deleteFile,
};
