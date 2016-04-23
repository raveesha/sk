'use strict';

var express = require('express');
var controller = require('./log.controller.js');

var router = express.Router();

router.get('/', statsd('logs'),controller.index);



module.exports = router;
