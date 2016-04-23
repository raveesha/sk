'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PayloadSchema = new Schema({
  title: String,
  body: String,
  tag: String,
  icon: String,
  link: String
});

module.exports = mongoose.model('Payload', PayloadSchema);
