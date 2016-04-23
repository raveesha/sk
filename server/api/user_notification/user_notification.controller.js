/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/users/:id/notifications              ->  index
 * POST    /api/users/:id/notifications              ->  create
 * GET     /api/users/:id/notifications/:id          ->  show
 * PUT     /api/users/:id/notifications/:id          ->  update
 * DELETE  /api/users/:id/notifications/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var config = require('./../../config/environment');
var Notification = require('./../notification/notification.model');
var Subscription = require('./../subscription/subscription.model');
var User = require('./../user/muser.model.js');


// Gets a list of Sends
exports.index = function(req, res) {
  // Listing Notification
  var limit = req.query.limit || config.query.limit || 20;
  var offset = req.query.offset || 0;
  var user_id = req.params.id;
  if(!user_id){ return handleNotFound(res,err); }

  // Setting user last_access time, So Notification latest_count will become zero
  var conditions = { user_id: user_id}
    , update = { $set : { last_access : new Date() }}
    , options = { multi: false };
  User.update(conditions, update, options, function(err, numAffected){
    if(err){ return console.log("user last access time update error",err, numAffected)}
    console.log("Aysnc: user last access time  Updated")
  });

  // Update all notifications of the user to fetched
  var Nconditions = { user_id: user_id, status:'queued'}
    , Nupdate = { $set : { status : 'fetched' }}
    , Noptions = { multi: true };
  Notification.update(Nconditions, Nupdate, Noptions, function(err, numAffected){
    if(err){ return console.log("Error: all pending notification fetched",err, numAffected)}
    console.log("Aysnc: all pending notification status set to fetched  ")
  });



  var currentFind = Notification.find({
      user_id: user_id
    })

  if(!isNaN(parseFloat(limit))){
    currentFind.limit(parseInt(limit,10))
  }

  if(!isNaN(parseFloat(offset))){
    currentFind.skip(parseInt(offset,10))
  }
  currentFind.sort({create_at: -1})
  currentFind.populate('payload')
    .exec(function(err,notifications){
      if(err) handleError(res,err)
      res.json(notifications)
    })

};

// Set All notifications READ Flag to false
exports.markallread = function(req, res) {
  var user_id = req.params.id;
  var conditions = { user_id: user_id, read: false }
    , update = { $set : { read : true }}
    , options = { multi: true };
  Notification.update(conditions, update, options, function(err, numAffected){
    if(err){ return handleError(res,err)}
    return res.json({"message":"success",description:"successfully updated",data:numAffected.nModified})
  })
}

exports.count = function(req, res) {
  if(req.params.id) {
    var user_id = req.params.id;
    Notification.count({user_id:req.params.id,read:false}, function (err, count) {
      if (err) {
        return handleError(res, err)
      }
      User.findOne({user_id:req.params.id},function(err,user){
        if (err) { return handleError(res, err) }
        if(user){
          //
          Notification.count({
            user_id:req.params.id,
            read:false,
            create_at:{
              $gt: user.last_access
            }
          }, function (err, recent_count) {
            if (err) { return handleError(res, err) }
            return res.json({"message": "success",fresh_fetch:true, count: count,recent_count:recent_count});
          })
        } else {
          return res.json({"message": "success",fresh_fetch:false ,count: count,recent_count:count});
        }
        //user_last_access_time ,"last_access":{ $gt: user_last_access_time }
      })
    })
  } else {
    return handleBadRequest(res,{message:"failure",description:"Bad Request"})
  }
}

function handleBadRequest(res,err){
  return res.status(400).json(err);
}

function handleError(res, err) {
  return res.status(500).json(err);
}

function handleNotFound(res, err){
  return res.status(500).json(err);
}
