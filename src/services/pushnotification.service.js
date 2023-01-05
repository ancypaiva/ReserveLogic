const pushnotifications = require('@armiasystems/pushnotification');

const pushnotification = async (serviceAccount, databaseurl, registrationToken, payload, options) => {
  await pushnotifications.pushnotification(serviceAccount, databaseurl, registrationToken, payload, options);
};

module.exports = { pushnotification };
