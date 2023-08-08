const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'staging').required(),
    PORT: Joi.number().default(3000),
    DB_CONNECTION: Joi.string().required().description('Database connection string'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    FROM_EMAIL: Joi.string().description('the from field in the emails sent by the app'),
    REDIS_HOST: Joi.string().description('redis host'),
    REDIS_PORT: Joi.number().description('redis port'),
    REDIS_PASS: Joi.string().description('redis password'),
    REDIS_CONNECTION: Joi.string().required().description('redis connection string'),
    REDIS_EXPIRY: Joi.number().description('default redis expiry in seconds'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  socketStatus: envVars.SOCKET_STATUS,
  mongoose: {
    url: envVars.DB_CONNECTION + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {},
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.FROM_EMAIL,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    pass: envVars.REDIS_PASS,
    url: envVars.REDIS_CONNECTION,
    expiry: envVars.REDIS_EXPIRY,
  },
  postmark: {
    postark: envVars.POST_MARK,
    template: envVars.POST_MARK_TEMPLATE,
    template2: envVars.POST_MARK_FORGET_PASSWORD,
  },
  decrypt: envVars.ENCRYPT_SECERET_KEY,
  redirecturl: envVars.REDIRECT_URL,
  verificationEmailUrl: envVars.VERIFICATIONEMAILURL,
  resetPasswordUrl: envVars.RESETPASSWORDURL,
  exporturl: envVars.EXPORTURL,
};
