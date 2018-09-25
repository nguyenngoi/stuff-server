const compose = require('../utils/compose');
const logRequest = require('./logRequest');
const response = require('./response');
const checkToken = require('./token');
const setupRequestData = require('./setupRequest');

module.exports = compose([
  response,
  logRequest,
  checkToken,
  setupRequestData,
]);