/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/register              ->  index
 * POST    /api/register              ->  create
 * GET     /api/register/:id          ->  show
 * PUT     /api/register/:id          ->  update
 * DELETE  /api/register/:id          ->  destroy
 */

'use strict';

// Redirect to new route
exports.index = function(req, res) {
  res.redirect(301, '/api/subscriptions')
};

exports.post = function(req, res) {
  res.redirect(307, '/api/subscriptions')
};

exports.send = {};
exports.send.index = function(req, res) {
  res.redirect(301, '/api/notifications' )
};

exports.send.post = function(req, res) {
  res.redirect(307, '/api/notifications' )
};


