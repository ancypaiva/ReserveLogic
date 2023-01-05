/* eslint-disable global-require */
const amazonS3 = require('@armiasystems/s3-upload');
const httpStatus = require('http-status');
const multer = require('multer');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { formatResponse } = require('../utils/commonUtils');
const { userService } = require('../services');

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

const createUser = catchAsync(async (req, res) => {
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
  const user = await userService.createUser(insertUser);
  res.send(formatResponse(true, 200, 'create-user', { user }));
  return res.json({ success: false, msg: 'Error uploading file..' });
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['active']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'searchBy', 'autocomplete']);
  const result = await userService.queryUsers(filter, options);
  res.send(formatResponse(true, 200, 'get-users', { result }));
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user || user.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(formatResponse(true, 200, 'get-user', { user }));
});

const updateUser = catchAsync(async (req, res) => {
  const oldData = await userService.getUserById(req.params.userId);
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
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(formatResponse(true, 200, 'update-users', { user }));
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.deleteUserById(req.params.userId);
  res.send(formatResponse(true, 200, 'delete-user', { user }));
});
const deleteMultipleUser = catchAsync(async (req, res) => {
  await userService.deleteMultipleUsers(req, res);
});
const deleteFile = catchAsync(async (req, res) => {
  const user = await userService.removeFile(req.params.userId, req.params.fileIndex);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(formatResponse(true, 200, 'delete-file', { user }));
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
      await userService.updateUserById(user, {
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
    await userService.updateUserById(user, {
      image: req.body.image,
    });

    return res.send(formatResponse(true, 200, 'remove-upload', { location: req.body.image }));
  }
});
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteMultipleUser,
  deleteFile,
  postImageUpload,
  removeImageUpload,
};
