'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  user_id: { type: String, required: true},
  last_access: { type: Date, default: Date.now }
});

module.exports = mongoose.model('user', UserSchema);
