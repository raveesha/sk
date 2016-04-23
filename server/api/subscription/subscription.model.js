'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SubscriptionSchema = new Schema({
  user_id: { type: String, required: true},
  subscription_id: { type: String, required: true}
});

module.exports = mongoose.model('subscription', SubscriptionSchema);
