const crypto = require('crypto');
const config = require('config');
const UserEntity = require('../entities/UserEntity');

module.exports = ({ UserRepository }) => {

  async function createUser(param) {
    try {
      const user = new UserEntity(param);
      const password = await hashPassword(param.password);
      return await UserRepository.create({ ...user, password });
    } catch (error) {
      throw error;
    }
  }

  function hashPassword(password) {
    try {
      return crypto.createHmac(
        'sha512',
        config.secret.hashKey
      )
        .update(password)
        .digest('hex');
    } catch (error) {
      throw error;
    }
  }

  return {
    createUser,
    hashPassword,
  };
};