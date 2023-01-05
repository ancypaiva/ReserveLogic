const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

/**
 * Validate password strength
 * @param {Text} value of password
 * @param {Object} helpers
 * @returns {Object<helpers>}
 */
const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('Password must contain at least 1 letter and 1 number');
  }
  return value;
};

/**
 * Validate international phone numbers
 * @param {Text} value of phone number
 * @param {Object} helpers
 * @returns {Object<helpers>}
 * supported formats
 * (123) 456-7890
 * (123)456-7890
 * 123-456-7890
 * 123.456.7890
 * 1234567890
 * +31636363634
 * 075-63546725
 */
const phoneNumber = (value, helpers) => {
  const validateRegex = /^$|^[+]?[(]?\d{3}[)]?[-s.]?\d{3}[-s.]?\d{1,9}$/im;

  if (!value.match(validateRegex)) {
    return helpers.message('Invalid phone number format');
  }
  return value;
};

module.exports = {
  objectId,
  password,
  phoneNumber,
};
