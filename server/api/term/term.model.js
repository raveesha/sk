'use strict';

module.exports = function(sequelize, DataTypes) {
  var Term = sequelize.define('Term', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    word: DataTypes.STRING(100),
    gender:DataTypes.STRING(100),
    kan_meaning:DataTypes.STRING(100),
    San_meaning:DataTypes.STRING(100),
    Book_ref:DataTypes.STRING(100),
    Vyutpatti:DataTypes.STRING(100),
    Ashtadhyayi_Sutra_Ref:DataTypes.STRING(100),
  },

    {
    instanceMethods: {

    },

    classMethods: {
      associate: function associate(models) {


      },

    },

    hooks: {
      beforeCreate: function beforeCreate(instance) {

      },

      beforeUpdate: function beforeUpdate(instance) {

      },
    },
  });

  return Term;
}

