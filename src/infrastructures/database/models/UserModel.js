const mongoose = require('mongoose');
const Schema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    user_name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    address: String,
    phone: String,
    status: {
      type: Number,
      default: 1,
    }
  }
);

module.exports = Schema;