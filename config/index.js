const joi = require('joi');

const envName = process.env.NODE_ENV || 'development';
const configEnv = require(`./${envName}.json`);

const schema = joi.object({
  env: joi.string().required(),
  web: joi.object({
    port: joi.number().required(),
  }).required(),
  logging: joi.object({
    dir: joi.string().required(),
    level: joi.string().required(),
    enable: joi.boolean().required(),
  }).required(),
  mongodb: joi.object({
    host: joi.string().required(),
    port: joi.number().required(),
    dbname: joi.string().required(),
    username: joi.string().allow('').required(),
    password: joi.string().allow('').required(),
  }).required(),
  secret: joi.object({
    hashKey: joi.string().required(),
    privateFile: joi.string().required(),
    publishFile: joi.string().required(),
    tokenTime: joi.string().required(),
    tokenAlgorithm: joi.string().required(),
    passphrase: joi.string().required(),
  }).required(),
});

const { error, value } = joi.validate(configEnv, schema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = Object.freeze(value);