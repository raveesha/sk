'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  user_id: String,
  payload:  { type : Schema.Types.ObjectId, ref: 'Payload' },
  status: String,
  read: { type: Boolean, default: false },
  create_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
