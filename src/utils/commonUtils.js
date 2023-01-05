/**
 * Create a formatted response object
 * @param {string} context
 * @param {Object} dataObj
 * @returns {Object}
 */

const formatResponse = (success, code, context, dataObj) => {
  return {
    success,
    code,
    context,
    data: dataObj,
  };
};

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = {
  formatResponse,
  pick,
};
