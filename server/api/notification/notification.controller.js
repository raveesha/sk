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

var Notification = require('./notification.model');
var Subscription = require('./../subscription/subscription.model');
var Payload = require('./../payload/payload.model');
var Log = require('./../log/log.model');

// Gets a list of Sends
exports.index = function(req, res) {
  res.json({message:"redirect",description:"Try /users/:id/notifications"})
};

exports.clearQueue = function(req, res){
  // Update all notifications of the user to fetched
  var Nconditions = { status:'queued'}
    , Nupdate = { $set : { status : 'fetched' }}
    , Noptions = { multi: true };
  Notification.update(Nconditions, Nupdate, Noptions, function(err, numAffected){
    if(err){  console.log("Error: all pending notification fetched",err, numAffected)}
    res.json({numAffected:numAffected})
    console.log("Aysnc: all pending notification status set to fetched  ")
  });

}

// Gets a single Send from the DB
exports.fetch = function(req, res) {
  var subscription_id = req.params.id;
  if(subscription_id){
    Subscription.findOne({
      "subscription_id" : subscription_id
    },function(err,subscription){
      if(err) handleError(res,err)
      if(typeof subscription !== 'undefined' &&  subscription !== null) {
        Notification.find({
          user_id: subscription.user_id,
          status: 'queued'
        }).sort({create_at: -1})
          .select('payload')
          .populate('payload')
          .exec(function(err,latestNotificationArray){
            if(err) handleError(res,err)
            if(latestNotificationArray.length == 0){
              Notification.find({
                user_id: subscription.user_id,
              }).sort({create_at: -1})
                .limit(1)
                .select('payload')
                .populate('payload')
                .exec(function(err,notification){
                  if(err) handleError(res,err)
                  if(notification.length === 0){
                    return handleEntityNotFound(res,{message:'o User don\'t have any notifications'})
                  } else  { // Only one notification found
                    if(exists(notification[0].payload)){
                      return res.json(notification[0].payload)
                    } else {
                      return handleError(res,{message:"failure",description:"Notification Payload Missing"})
                    }
                  }
                })
            } else { // Notifications found
              if(exists(latestNotificationArray[0].payload)){
                var count = latestNotificationArray.length;
                latestNotificationArray[0].payload.body = latestNotificationArray[0].payload.body || "";
                if(count > 1){
                  latestNotificationArray[0].payload.body += " (You have " + (count-1) + " more notifications)"
                  latestNotificationArray[0].payload.link = config.quarc.NOTIFICATION_PAGE_URL;
                }

                // Overcome Discarding previous notification
                if(exists(latestNotificationArray[0].payload.tag)){
                  latestNotificationArray[0].payload.tag += "|||"+(new Date().getTime()).toString()
                } else {
                  latestNotificationArray[0].payload.tag = (new Date().getTime()).toString()
                }

                updateNotificationStatus(latestNotificationArray,"fetched")
                return res.json(latestNotificationArray[0].payload)
              } else {
                return handleError(res,{message:"failure",description:"Payload Body Missing"})
              }
            }
        })

      } else {
        return res.status(404).end();
      }
    });
  }
};

// Creates a new Send in the DB
exports.create = function(req, res) {
  var notification = req.body;
  if( typeof notification.user_id && typeof notification.payload){
    // PENDING: validate schema before save and throw error
    Payload.create(notification.payload,function(err, payload){
      if(err) return handleError(res, err);
      notification.payload = payload;
      notification.status = 'queued';
      Notification.create(notification, function(err, notification) {
        if(err) { return handleError(res, err); }
        // HERE ---> Notification Stored to MongoDB Async
      });
    });
    // Forwarding every notifications requesting from Quarc
    var user_id = notification.user_id;
    //var nowForQuery = new Date();
    //var fiveMinuteBefore = nowForQuery.setMinutes(nowForQuery.getMinutes() - 1)
    //create_at:{
    //  $gt: fiveMinuteBefore
    //}
    Notification.findOne({
      user_id:user_id,
      status:'queued'

    },function(err,notificationForQueuedCount) {
      if (err) {
        return handleError(res, err);
      }
      if(!notificationForQueuedCount){
        Subscription.find({user_id: user_id}, function (err, users) {
          if (err) {
            return handleError(res, err);
          }
          var filteredUsers = users;
          if (filteredUsers.length) {
            var subscription_ids = _.uniq(_.pluck(filteredUsers, 'subscription_id'));

            // As on 20th Jan 2016 - https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web
            // A downside to the current implementation of the Push API in Chrome is that you can’t send any data with a push message
            // We not sending any payload to GCM
            var options = {
              url: "https://android.googleapis.com/gcm/send",
              method: "POST",
              headers: {
                'Authorization': 'key=' + config.GCM_API_KEY,
                'Content-Type': 'application/json'
              },
              json: true,
              body: {
                "registration_ids": subscription_ids,
              }
            };

            // Sending POST Request to GCM
            request(options, function (error, response, body) {
              if (error) {
                return handleError(res, err);
              }
              var success_count = reportMissing(subscription_ids, body.results)
              res.status(201).json({
                message: 'success',
                success: success_count,
                data: body
              });
            });
          } else {
            handleEntityNotFound(res, {"message": "subscriptions not found"})
          }
        });
      } else {
        res.status(201).json({
          message: 'success',
          description: "notification created but not signaled to GCM",
        });
      }
    });
  }
};

// Set READ Flag to true
exports.read = function(req, res) {
  var notification_id = req.params.id;
  var conditions = { _id: notification_id, read: false }
    , update = { $set : { read : true }}
    , options = { multi: false };
  Notification.update(conditions, update, options, function(err, numAffected){
    if(err){ return handleError(res,err)}
    if(numAffected.nModified === 1){
      return res.json({"message":"success",description:"successfully updated"})
    }
    return res.json({"message":"success",description:"already updated"})

  })
}

// Set READ Flag to false
exports.unread = function(req, res) {
  var notification_id = req.params.id;
  var conditions = { _id: notification_id, read: true }
    , update = { $set : { read : false }}
    , options = { multi: false };
  Notification.update(conditions, update, options, function(err, numAffected){
    if(err){ return handleError(res,err)}
    if(numAffected.nModified === 1){
      return res.json({"message":"success",description:"successfully updated"})
    }
    return res.json({"message":"success",description:"already updated"})


  })
}

exports.deprecated = function(req, res) {
  var subscription_id = req.params.id || "";
  res.redirect(301, '/api/notifications/fetch/'+subscription_id)
}

function updateNotificationStatus(notifications,updateStatus) {
  notifications.map(function (notification) {
    notification.status = updateStatus;
    notification.save(function (err) {
      if (err) {
        console.log("error while async save")
      }
    })
  })
}

function exists(input){
  return typeof input !== undefined && typeof input !== null
}

function handleError(res, err) {
  return res.status(500).json(err);
}

function handleEntityNotFound(res,err){
  return res.status(404).json(err)
}

function reportMissing(subscription_ids, gcm_results){
  if(subscription_ids.length){
    var success_count = 0;
    var subscriptions_for_log = []
    subscription_ids.forEach(function(item, index){
      if(_.has(gcm_results[index],'message_id')){
        success_count++;
      } else {
        subscriptions_for_log.push({subscription_id:item,message:gcm_results[index]})
      }
    });

    var subscriptions_ids_to_remove = _.pluck(subscriptions_for_log,"subscription_id");
    if(subscriptions_ids_to_remove.length){
      Subscription.remove({ subscription_id: { $in: subscriptions_ids_to_remove } },function(err,subscriptions){
        if(err){ return console.log("Error: notification.controller.js",err) }
        var log = {type:"delete",message:"gcm",description:JSON.stringify(subscriptions_for_log)}
        Log.create(log,function(err, payload){})
      });
    }
    return success_count;
  } else {
    return 0;
  }
}

