const { postmarkService } = require('../services');
const { pushnotification } = require('../services');
const catchAsync = require('../utils/catchAsync');

const serviceAccount = require('../config/infinity-saver-firebase-adminsdk-f8vmk-7557588794.json');

const databaseurl = 'https://infinity-saver-default-rtdb.firebaseio.com';

const registrationToken = 'vsu2yr8764498thfi4yr97y29fiu1trd6r316et972ehgouro';

const payload = {
  notification: {
    title: 'Portugal vs. Denmark',
    body: 'great match!',
  },
  data: {
    Nick: 'Mario',
    Room: 'PortugalVSDenmark',
  },
};

const sendEmailControl = catchAsync(async (req, res) => {
  const data = await postmarkService.SendEmail(req, res);
  res.send(data);
});
const sendPushnotification = catchAsync(async (_req, res) => {
  const data = await pushnotification.pushnotification(serviceAccount, databaseurl, registrationToken, payload);
  res.send(data);
});
module.exports = {
  sendEmailControl,
  sendPushnotification,
};
