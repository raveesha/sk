'use strict';

var express = require('express');
var controller = require('./subscription.controller.js');

var router = express.Router();

router.get('/', statsd('subscriptions'), controller.index);
router.post('/', statsd('subscriptions'), controller.create);
router.delete('/:id', statsd('subscriptions.id'), controller.destroy);

module.exports = router;
