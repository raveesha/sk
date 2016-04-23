'use strict';

// Development specific configuration
// ==================================
module.exports = {

  ip:     process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP ||
  undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
  process.env.PORT ||
  3010,

  mysql:{
    db: process.env.MYSQL_DB,
    user:process.env.MYSQL_USER,
    pass:process.env.MYSQL_PASS,
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: true,
    timezone: '+05:30',
  },

};
