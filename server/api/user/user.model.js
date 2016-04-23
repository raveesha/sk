'use strict';

var crypto = require('crypto');
var salt = 'DYhG93b0fIxfs2guVoUubasdfajfkljasdjfaklsdjflakrfWwvniR2G0FgaC9mi';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      validate: {
        len: {
          args: [0, 100],
          msg: 'Maximum length for name field is 100',
        },
      },
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(32),
      validate: {
        len: {
          args: [7, 32],
          msg: 'password field length should be between 7 and 32',
        },
      },
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

  }, {
    instanceMethods: {
      verifyPassword: function verifyPassword(password, cb) {
        var hashedPass = crypto
          .createHash('md5')
          .update(salt + password)
          .digest('hex');
        return (hashedPass === this.password) ?
          cb(null, this.toJSON()) : cb(new Error('Check password!'));
      },

      hashPassword: function hashPassword(password) {
        return crypto
          .createHash('md5')
          .update(salt + password)
          .digest('hex');
      },
    },

    classMethods: {
      associate: function associate(models) {


      },
      checkEmailExiists: function(models,email){
        if (!models) return Promise.reject({code: 500, desc: "checkEmailExiists: models not found"})
        if (!email) return Promise.reject({code: 500, desc: "checkEmailExiists: email not found"})
        return models.User.count({ where: {email: email}}).then(function(rows){
          if (rows > 0) return Promise.resolve(true)
          return Promise.resolve(false)
        })
      },
      checkMobileExiists: function(models,mobile){
        if (!models) return Promise.reject({code: 500, desc: "checkMobileExiists: models not found"})
        if (!mobile) return Promise.reject({code: 500, desc: "checkMobileExiists: mobile not found"})
        return models.User.count({ where: {mobile: mobile}}).then(function(rows){
          if (rows > 0) return Promise.resolve(true)
          return Promise.resolve(false)
        })
      },
      checkExists: function(models, email, mobile){
        // TODO Validatio for email id and phone number for same job

        return Promise.all([
              email ? models.User.checkEmailExiists(models, email) : Promise.resolve(false),
              mobile ? models.User.checkMobileExiists(models,  mobile) : Promise.resolve(false)
            ])
            .then(function(rePr){ return {email: rePr[0], mobile: rePr[1]} })
      },
    },

    hooks: {
      beforeCreate: function beforeCreate(instance) {
        if (instance.changed('password')) {
          instance
            .set('password', instance.hashPassword(instance.password));
        }
      },

      beforeUpdate: function beforeUpdate(instance) {
        if (instance.changed('password')) {
          instance
            .set('password', instance.hashPassword(instance.password));
        }
      },
    },
  });

  return User;
}

