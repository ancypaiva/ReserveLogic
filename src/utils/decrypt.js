const CryptoJS = require('crypto-js');
// eslint-disable-next-line import/prefer-default-export
const Decrypt = (value) => {
  const reb64 = CryptoJS.enc.Hex.parse(value.toString());
  const bytes = reb64.toString(CryptoJS.enc.Base64);
  const decrypt = CryptoJS.AES.decrypt(bytes, process.env.ENCRYPT_SECERET_KEY);
  const plain = decrypt.toString(CryptoJS.enc.Utf8);
  return plain;
};
module.exports = Decrypt;
