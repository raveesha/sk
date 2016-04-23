'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();
console.log(process.env.NODE_ENVX)
router.get('/', controller.index);
//router.get('/me', controller.me);
//router.get('/states', controller.states);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
