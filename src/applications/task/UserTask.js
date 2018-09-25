const AdaterTask = require('../AdapterTask');

class UserTask extends AdaterTask {
  constructor({ UserRepository, UserService }) {
    super(UserRepository);
    this.UserService = UserService;
  }
  async create(param) {
    try {
      return await this.UserService.createUser(param);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserTask;