const joi = require('joi');

module.exports = {
  getAll(param) {
    const schema = joi.object({
      limit: joi.string().regex(/\d/g),
      page: joi.string().regex(/\d/g),
      sort: joi.string(),
      direction: joi.string(),
    }).unknown();
    return joi.validate(param, schema);
  },
  create(param) {
    const schema = joi.object({
      user_name: joi.string().required(),
      first_name: joi.string().required(),
      last_name: joi.string(),
      email: joi.string().email().required(),
      password: joi.string().required(),
      address: joi.string(),
      phone: joi.string(),
    }).unknown();
    return joi.validate(param, schema);
  }
};