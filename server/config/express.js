/**
 * Express configuration
 */

'use strict';

var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var cors = require('cors');
//var expressStatsd = require('express-statsd');
var config = require('./environment');

module.exports = function(app) {
  var env = app.get('env');
  app.use(cors());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(express.static(path.join(config.root, 'client')));

  // StatsD by Uber
  //GLOBAL.statsd = function (path) {
  //  return function (req, res, next) {
  //    var method = req.method || 'unknown_method';
  //    req.statsdKey = [config.statsd.prefix,'http', method.toLowerCase(), path].join('.');
  //    next();
  //  };
  //}

  //app.use(function(req,res,next){
  //  req.statsdKey = config.statsd.prefix
  //  next();
  //})
  //app.use(expressStatsd({
  //  host: config.statsd.host,
  //  port: config.statsd.port
  //}));
  //app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(xerrorHandler);
  app.use(errorHandler());
  app.use(morgan('dev'));
};
//function logErrors(err, req, res, next) {
//  console.error(err.stack);
//  next(err);
//}


function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}
function xerrorHandler(err, req, res, next) {
  res.status(500);
  res.json({error: err });
}
