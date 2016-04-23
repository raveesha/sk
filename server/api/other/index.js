'use strict';

var express = require('express');
var controller = require('./other.controller.js');

var router = express.Router();

router.get('/register', statsd('register'), controller.index);
router.post('/register', statsd('register'), controller.post);

router.get('/send', statsd('send'), controller.send.index);
router.post('/send', statsd('send'), controller.send.post);

module.exports = router;
