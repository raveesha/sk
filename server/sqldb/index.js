/**
 * Sequelize initialization module
 */

'use strict';

var fs = require('fs');
var path = require('path');
var config = require('../config/environment');
var Sequelize = require('sequelize');

var db = {
  Sequelize:Sequelize,
  sequelize: new Sequelize(
    config.mysql.db, config.mysql.user,
    config.mysql.pass, config.mysql
  )
};

//// Quarc - Insert models below
db.User = db.sequelize.import('../api/user/user.model');
db.Chain = db.sequelize.import('../api/chain/chain.model');
db.Term = db.sequelize.import('../api/term/term.model');
db.SanskritWord = db.sequelize.import('../api/sanskritWord/sanskritWord.model');
db.SanskritKannada = db.sequelize.import('../api/sanskritKannada/sanskritKannada.model');
db.KannadaWord = db.sequelize.import('../api/kannadaWord/kannadaWord.model');
db.SanskritPratyaya= db.sequelize.import('../api/sanskritPratyaya/sanskritPratyaya.model');
db.SWordsPratyaya= db.sequelize.import('../api/sWordsPratyaya/sWordsPratyaya.model');




Object.keys(db).forEach(function model(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

// db.sequelize.sync().then(function(suc){ console.log("mysql sync success")})
//   .catch(console.error)

module.exports = db;
