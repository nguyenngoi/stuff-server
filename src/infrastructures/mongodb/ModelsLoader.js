const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

module.exports = {
  load({ baseFolder, indexFile = 'index.js' }) {
    const loaded = {};
    fs
      .readdirSync(baseFolder)
      .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== indexFile) && (file.slice(-3) === '.js');
      })
      .forEach((file) => {
        const schema = require(path.join(baseFolder, file));
        this.setSchema(schema);
        const modelName = file.split('.')[0];
        loaded[modelName] = mongoose.model(modelName.replace(/Model/g, '').toLowerCase(), schema);
      });

    return loaded;
  },

  setSchema(schema) {
    schema.set(
      'timestamps',
      {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
    schema.set('versionKey', false);
    schema.set(
      'toJSON',
      {
        getters: true,
        virtuals: false,
      }
    );
    schema.pre('save', function (next) {
      if (this.isNew) {
        this.update({}, { $set: { updated_at: new Date(), created_at: new Date() } });
      } else {
        this.update({}, { $set: { updated_at: new Date() } });
      }
      return next();
    });

    schema.pre('update', function (next) {
      this.update({}, { $set: { updated_at: new Date() } });
      return next();
    });

    return schema;
  }
};
