'use strict';

var express = require('express');
var controller = require('./hotel.controller');

var router = express.Router();

router.get('/:chainId/hotels', controller.index);
router.get('/:chainId/hotels/:id', controller.show);
router.post('/:chainId/hotels/', controller.create);
router.put('/:chainId/hotels/:id', controller.update);
router.patch('/:chainId/hotels/:id', controller.update);
router.delete('/:chainId/hotels/:id', controller.destroy);

module.exports = router;
