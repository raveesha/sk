/**
 * Sequelize initialization module
 */

'use strict';

var fs = require('fs');
var path = require('path');
var config = require('../config/environment');
var Sequelize = require('sequelize');

console.log(config.mysql)
var db = {
  Sequelize:Sequelize,
  sequelize: new Sequelize(
    config.mysql.db, config.mysql.user,
    config.mysql.pass, config.mysql
  )
};

//// Quarc - Insert models below
db.User = db.sequelize.import('../api/user/user.model');



Object.keys(db).forEach(function model(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize.sync().then(suc => console.log("mysql sync success"))
  .catch(console.error)

module.exports = db;
