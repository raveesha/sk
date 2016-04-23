/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/send              ->  index
 * POST    /api/send              ->  create
 * GET     /api/send/:id          ->  show
 * PUT     /api/send/:id          ->  update
 * DELETE  /api/send/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var request = require('request');
var config = require('./../../config/environment');

var Log = require('./../log/log.model');

// Gets a list of Sends
exports.index = function(req, res) {
  Log.find()
    .sort({create_at: -1})
    .exec(function(err,logs){
      res.json(logs)
    })

};


function handleError(res, err) {
  return res.status(500).json(err);
}

function handleEntityNotFound(res,err){
  return res.status(404).json(err)
}


