const mongoose = require('mongoose');

module.exports = config => {
  return new Promise((resolve, reject) => {
    const mongodb = config.mongodb;
    mongoose.connect(
      `mongodb://${mongodb.username}:${mongodb.password}@${mongodb.host}:${mongodb.port}/${mongodb.dbname}`,
      {
        poolSize: 10,
        keepAlive: true,
        useNewUrlParser: true,
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        console.info('Mongo connected');
        return resolve();
      }
    );
  });
};