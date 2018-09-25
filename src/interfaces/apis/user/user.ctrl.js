const valid = require('./user.valid');
const Status = require('http-status');

module.exports = {
  async getAll(ctx) {
    try {
      let UserTask = ctx.scope.resolve('UserTask');
      let { error, value } = valid.getAll(ctx.request.query);
      if (error) {
        throw error;
      }
      return ctx.body = await UserTask.getAll(value);
    } catch (error) {
      throw error;
    }
  },
  async getDetail(ctx) {
    try {
      let UserTask = ctx.scope.resolve('UserTask');
      let data = await UserTask.getDetail(ctx.params.user_id);
      if (!data || !Object.keys(data).length) {
        throw Status.NOT_FOUND;
      }
      return ctx.body = data;
    } catch (error) {
      throw error;
    }
  },
  async create(ctx) {
    try {
      let UserTask = ctx.scope.resolve('UserTask');
      const { error, value } = valid.create(ctx.request.body);
      if (error) {
        throw error;
      }
      return ctx.body = await UserTask.create(value);
    } catch (error) {
      throw error;
    }
  }
};