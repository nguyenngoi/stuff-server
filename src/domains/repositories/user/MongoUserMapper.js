const UserEntity = require('../../entities/UserEntity');

module.exports = {
  toEntity(data) {
    return new UserEntity(data);
  }
};