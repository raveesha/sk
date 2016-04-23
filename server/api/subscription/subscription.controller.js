/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/subscription              ->  index
 * POST    /api/subscription              ->  create
 * GET     /api/subscription/:id          ->  show
 * PUT     /api/subscription/:id          ->  update
 * DELETE  /api/subscription/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var request = require('request');
var Subscription = require('./subscription.model');
var User = require('./../user/muser.model.js');

// Show POST method availablity
exports.index = function(req, res) {
  res.status(404).json({
    "message":"failure",
    description: "can't GET, Try POST"
  })
};

// Creates a new Send in the DB
exports.create = function(req, res) {
  if(!(_.has(req.body, 'subscription_id') && _.has(req.body, 'user_id'))){
    return handleBadRequest(res,{"message":"bad request",description:"check body"})
  }
  var user_id = req.body.user_id;
  Subscription.findOne({subscription_id:req.body.subscription_id},function(err, subscription){
    if(err) { return handleBadRequest(res, err); }
    if(subscription){
      if( subscription.user_id == req.body.user_id){
        return res.status(409).json({"message":"Duplicate Subscription. Nothing done"})
      } else {
        subscription.user_id =  req.body.user_id
        subscription.save(function (err) {
          if(err)  return console.log("Error",err)
          return console.log(req.body.user_id," updated")
        });
        return res.json({"message":"Subscription already exist. Updated userid"})
      }
      //return alreadyExist(res,_.pick(subscription,'user_id','subscription_id'))
    }
    return Subscription.create(req.body, function(err, subscription) {
      if(err) { return handleBadRequest(res, err); }
      // ASYNC: Send Welcome Notification if User is NEW
      User.findOne({user_id:user_id},function(err,user) {
        if (err) { return logAsyncError(err); }
        if (!user) {
          User.create({user_id:user_id},function(err, user){
            if(err){ return logError(err) }
            sendTestNotification(req);
            return logAsyncSuccess(user)})
        }
      });
      return res.status(201).json(_.pick(subscription,'user_id','subscription_id'));
    });
  })

};

exports.destroy = function(req, res) {
  if(req.params.id){
    Subscription.remove({ subscription_id: req.params.id },function(err,subscriptions){
      if(err){ return handleError(res,err) }
      return res.json({"message":"success"})
    });
  } else {
    return handleBadRequest(res,{message:'failure',description:"subscription id not found"})
  }
};

function sendTestNotification(req){
  var hostURL = req.protocol + '://' + req.get('host');
  var body = {
    "user_id":req.body.user_id,
    "payload":{
      "title":"Quezx - Welcome Notification",
      "body":"Your subscription is successful.",
      "tag":"default",
      "icon":"https://app.quezx.com/img/quezx-png-logo.png",
      "link":"https://quezx.com/notifications"
    }
  };

  var fullUrl = hostURL + '/api/notifications';

  var options = {
    url:fullUrl,
    method:"POST",
    json:true,
    body: body
  };

  // Sending POST Request to GCM
  request(options, function (error, response, body) {
    console.log("Welocome notification sent to:",req.body.user_id)
  });
}
function handleError(res, err) {
  return res.status(500).json(err);
}

function handleBadRequest(res, err) {
  return res.status(400).json(err);
}

function alreadyExist(res,entity){
  return res.status(409).json(entity)
}

function qLog(type,error){
  var type = type || "Notice: ";
  var error = error || "Error description missing"
  return console.log(type,error);
}

function logError(msg){
  return qLog("Error: ",err)
}

function logSuccess(msg){
  return qLog("Success: ",msg)
}

function logAsyncSuccess(msg){
  return qLog("Async Success: ",msg)
}

function logAsyncError(msg){
  return qLog("Async Error: ",msg)
}

