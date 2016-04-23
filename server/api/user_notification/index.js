'use strict';

var express = require('express');
var controller = require('./user_notification.controller.js');

var router = express.Router();

router.get('/:id/notifications',statsd('users.id.notifications'), controller.index);
router.get('/:id/notifications/count', statsd('users.id.notifications.count'), controller.count);
router.post('/:id/notifications/read', statsd('users.id.notifications.read'), controller.markallread);

module.exports = router;
