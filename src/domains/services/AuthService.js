const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('config');

const privateKey = fs.readFileSync(`${process.cwd()}/config/${config.secret.privateFile}`, 'utf8');
const publishKey = fs.readFileSync(`${process.cwd()}/config/${config.secret.publishFile}`, 'utf8');

module.exports = ({ UserRepository, UserService }) => {

  async function login({ email, password }) {
    try {
      password = UserService.hashPassword(password);
      const user = await UserRepository
        .findForLogin({ email, password });

      if (!user) {
        throw new Error('user not found');
      }

      // generate token for user
      const token = _generateToken({ id: user.id });
      return { ...user, token };
    } catch (error) {
      throw error;
    }
  }

  function verifyToken(token) {
    try {
      return jwt.verify(
        token,
        publishKey,
        {
          algorithm: config.secret.tokenAlgorithm,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  function _generateToken(data) {
    try {
      return jwt.sign(
        {
          data,
        },
        privateKey,
        {
          expiresIn: config.secret.tokenTime,
          algorithm: config.secret.tokenAlgorithm,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  return {
    login,
    verifyToken,
  };
};