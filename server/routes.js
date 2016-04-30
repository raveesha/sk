/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app) {

  // Insert routes below

  app.use('/api/users', require('./api/user'));
  app.use('/api/chains', require('./api/chain'));
  //app.use('/api/chains', require('./api/chain/hotel'));
  app.use('/api/sanskritWords', require('./api/sanskritWord'));
  app.use('/api/kannadaWords', require('./api/kannadaWord'));
  app.use('/api/sanskritKannadas', require('./api/sanskritKannada'));
  app.use('/api/sanskritPratyayas', require('./api/sanskritPratyaya'));
  app.use('/api/sWordsPratyayas', require('./api/sWordsPratyaya'));


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

