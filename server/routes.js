/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app) {

  // Insert routes below

  app.use('/api/users', require('./api/user'));

  // mongo
  //app.use('/api/subscriptions', require('./api/subscription'));
  //app.use('/api/notifications', require('./api/notification'));
  //app.use('/api/users', require('./api/user_notification'));
  //app.use('/api/logs', require('./api/log'));
  //app.use('/api', require('./api/other'));

  // All undefined asset or api routes should return a 404
  app.use('/*',function(req,res){
    res.status(404).json({status: 404})
  })
};

