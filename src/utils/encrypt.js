const CryptoJS = require('crypto-js');
// eslint-disable-next-line import/prefer-default-export
const Encrypt = (value) => {
  const b64 = CryptoJS.AES.encrypt(value.toString(), process.env.ENCRYPT_SECERET_KEY).toString();
  const e64 = CryptoJS.enc.Base64.parse(b64);
  const eHex = e64.toString(CryptoJS.enc.Hex);
  return eHex;
};
module.exports = Encrypt;
