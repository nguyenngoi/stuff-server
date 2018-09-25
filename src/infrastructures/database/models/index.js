const ModelsLoader = require('../../mongodb/ModelsLoader');

module.exports = ModelsLoader.load(
  {
    baseFolder: __dirname,
  }
);