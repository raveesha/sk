/**
 * Main application file
 */

'use strict';
//var env = process.env.NODE_ENV =  'development';
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var http = require('http');

// Setup server
var app = express();
var server = http.createServer(app);
require('./config/express')(app);
require('./routes')(app);

if(app.get('env') != 'test') {
  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}
//
//if(app.get('env') === 'development')
//  mongoose.set('debug', true);
//// Connect to database
//mongoose.connect(config.mongo.uri, function(err) {
//  if (err) throw err;
//  // If not env.NODE_ENV == test then start server
//  // This if is useful for mocha tests
//
//});




// Expose app
exports = module.exports = app;
