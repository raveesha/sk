'use strict';

var express = require('express');
var controller = require('./notification.controller.js');

var router = express.Router();

router.get('/', statsd('notifications'), controller.index);
router.get('/clearQueue',  controller.clearQueue);
//router.get('/:id', controller.show);
router.get('/fetch/:id', statsd('notifications.fetch.id'), controller.fetch);
router.post('/', statsd('notifications'), controller.create);
router.post('/:id/read', statsd('notifications.read'), controller.read);
router.post('/:id/unread', statsd('notifications.unread'), controller.unread);

// Old Routes
router.get('/:id', controller.deprecated);


module.exports = router;
