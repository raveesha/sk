'use strict';

var should = require('should');
var app = require('./../../app');
var request = require('supertest');
var Q = require('q');

var user_id  = Math.random() * 100;
var subscription_id = "dlRYl4P4eyc:APA91bETzd9WdkZqJQQ_i_YdbHFKamJaYMPW0Fjprnq-D-xWtsqeQf8u0AH8jokGeD5ehodmv7h6z_MvlNVTnS_EgRuiTmtFh0JM2Hk2d72-9-XB-EeeW06rmCZzq_or5l0_4rkpNtmz";

var subscription = {
  "user_id":user_id,
  "subscription_id":subscription_id
};

var clientRegistration = function(){
  var deferred;
  deferred = Q.defer();
  describe('POST /api/subscriptions', function() {
    it('should respond with JSON object', function(done) {
      request(app)
        .post('/api/subscriptions')
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

var getNotifications = function(){
  var deferred;
  deferred = Q.defer();
  var user_id=447;
  describe('GET /api/users/'+ user_id +'/notifications', function() {
    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/users/'+ user_id +'/notifications')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          res.body[0].should.have.property("create_at");
          deferred.resolve(res.body);
          done();
        });
    });
  });
  return deferred.promise;
}


//
//clientRegistration()
//  .then(getNotifications())

