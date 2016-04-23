'use strict';

// Development specific configuration
// ==================================
module.exports = {


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
