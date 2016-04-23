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
  8080,

  mongo: {
    uri: 'mongodb://qnotify:0413b0c7eff14b4c5dcc326d61a67670@dokku-mongo-qnotify:27017/qnotify'
  },

  GCM_API_KEY: 'AIzaSyBtzd979liGa3_ysmy-rlf-ppaCPFB6toE',

  query:{
    limit: 20, // pagination default limit
  },

  statsd: {
    host: 'cloud.quezx.com',
    port: 8125,
    prefix: 'qnotify'
  },

  quarc: {
    NOTIFICATION_PAGE_URL: "https://staging.quezx.com/Notifications"
  }

};
