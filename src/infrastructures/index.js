const loggin = require('./logging');
const connectMongo = require('./mongodb/connect');

module.exports = {
  ...loggin,
  connectMongo,
};