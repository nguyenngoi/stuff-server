const { MongoAdapterRepository } = require('../../utils');
const UserMapper = require('./MongoUserMapper');

class UserRepository extends MongoAdapterRepository {
  constructor({ UserModel }) {
    super(UserModel, UserMapper);
  }
  async findForLogin({ email, password }) {
    try {
      const user = await this.model
        .findOne({ email, password })
        .lean();

      return this.toEntity(user);
    } catch (error) {
      throw error;
    }
  }
  async create(param) {
    try {
      // check user existed.
      let user = await this.model
        .findOne({
          $or: [
            {
              user_name: param.user_name,
            },
            {
              email: param.email,
            },
          ],
        })
        .lean();

      if (user) {
        throw new Error('User existed');
      }
      user = await this.model
        .create(param);

      return this.toEntity(user.toJSON());
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRepository;