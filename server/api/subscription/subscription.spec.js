/**
 * Test Cases
 * GET     /api/register          ->  404
 * POST    /api/register          ->  Blank Payload
 * POST    /api/register          ->  Duplicate Payload
 * POST    /api/register          ->  Valid Payload
 *  POST    /api/send               ->  Send Notifications
 *    POST    /api/notifications/:subscription_id      -> Fetch Notification
 */

'use strict';

var should = require('should');
var app = require('./../../app');
var request = require('supertest');
var Q = require('q');

var user_id  = "44";
var subscription_id = "dlRYl4P4eyc:APA91bETzd9WdkZqJQQ_i_YdbHFKamJaYMPW0Fjprnq-D-xWtsqeQf8u0AH8jokGeD5ehodmv7h6z_MvlNVTnS_EgRuiTmtFh0JM2Hk2d72-9-XB-EeeW06rmCZzq_or5l0_4rkpNtmz";
//should.Assertion.add(
//  // the name of the custom assertion
//  'ValidConfig',
//
//  // the implementation of the custom assertion
//  function() {
//    // `this.params` defines what text is associated with the
//    // pass/fail state of your custom assertion
//    this.params = { operator: 'to be a valid config' };
//
//    // `this.obj` refers to the object in the should.js chain upon
//    // which the assertion will be applied. `foo` would be `this.obj`
//    // in this example:
//    //
//    //     foo.should.be.a.String;
//    //
//    var config = this.obj;
//
//    // the assertion itself, just as above
//    should.exist(config);
//    config.should.be.an.Object;
//    (function() {
//      JSON.stringify(config);
//    }).should.not.throw();
//    should.exist(config.name);
//    config.name.should.be.a.String;
//    should.exist(config.value);
//    config.value.should.be.a.Number;
//    should.exist(config.isSomething);
//    config.isSomething.should.be.a.Boolean;
//  },
//
//  // is this a getter, meaning no function call?
//  //
//  //     foo.should.be.a.String         // getter
//  //     foo.should.be.equal('string'); // not a getter
//  //
//  true
//);

//// GET     /api/subscription          ->  404
//describe('GET /api/subscriptions', function() {
//  it('should respond with status 404', function(done) {
//    request(app)
//      .get('/api/subscriptions')
//      .expect(404)
//      .end(function(err, res) {
//        if (err) return done(err);
//        res.body.should.be.instanceof(Object);
//        done();
//      });
//  });
//});

//POST    /api/subscription          ->  Blank Payload / Wrong Payload -> 400 Bad Request
describe('POST /api/subscriptions', function() {
  it('should respond with 400 Bad Request', function(done) {
    request(app)
      .post('/api/subscriptions')
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
  });
});
var subscription = {
  "user_id":user_id,
  "subscription_id":subscription_id
};

var clientRegistration = function(){
  var deferred;
  deferred = Q.defer();
  describe('POST /api/subscription', function() {
    it('should respond with JSON object', function(done) {
      request(app)
        .post('/api/subscription')
        .send(subscription)
        .expect(201)
        //.expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          console.log(res.body)
          deferred.resolve(res.body);
          done();
        });
    });
  });
  return deferred.promise;
};

var notificationBody = {
  "user_id":user_id,
  "payload":{
    "title":"Manjesh - Bewakoof - HR Manager",
    "body":"Updated Status: Interview Backout. Please Inform the client ASAP",
    "tag":"Simple Tag",
    "icon":"https://app.quezx.com/img/quezx-png-logo.png",
    "link":"https://app.quezx.com/Applicants/view/2937"
  }
}

var sendNotification = function(){
  var deferred;
  deferred = Q.defer();
  describe('POST /api/notifications/send', function() {
    it('should respond with JSON object', function(done) {
      request(app)
        .post('/api/notifications/send')
        .send(notificationBody)
        .expect(201)
        //.expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          deferred.resolve(res.body);
          done();
        });
    });
  });
  return deferred.promise;
};

var fetchNotification = function(){
  var deferred;
  deferred = Q.defer();
  describe('GET /api/notifications/'+subscription_id, function() {
    it('should respond with JSON object', function(done) {
      request(app)
        .get('/api/notifications/'+subscription_id)
        .expect(200)
        //.expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          res.body
          console.log(res.body)
          deferred.resolve(res.body);
          done();
        });
    });
  });
  return deferred.promise;
};

function compare(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
var x = compare(notificationBody, notificationBody);
console.log(x)
//fetchNotification().then(function(response){
//  console.log('Notifications Sent')
//})

//clientRegistration()
//  .then(sendNotification())
//  .then(fetchNotification()
//    .then(function(response){
//      console.log('Fetch Notification Success',response)
//    })
//  )

// POST    /api/subscription          ->  Duplicate Payload  -> 409 Bad Request
//describe('POST /api/subscription', function() {
//  it('should respond with 409 Conflict', function(done) {
//    request(app)
//      .post('/api/subscription')
//      .send(subscription)
//      .expect(409)
//      .end(function(err, res) {
//        if (err) return done(err);
//        res.body.should.be.instanceof(Object);
//        done();
//      });
//  });
//});



