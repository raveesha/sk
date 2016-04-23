'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LogSchema = new Schema({
  message: String,
  type: String,
  description:  String,
  create_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);
