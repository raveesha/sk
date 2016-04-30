'use strict';

module.exports = function(sequelize, DataTypes) {
  var SWordsPratyaya = sequelize.define('SWordsPratyaya', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'swords_spratyayas',


    instanceMethods: {

    },

    classMethods: {
      associate: function associate(models) {
       SWordsPratyaya.belongsTo(models.SanskritPratyaya, {
          foreignKey: 'sanskritPratyayaId',
        });

        SWordsPratyaya.belongsTo(models.SanskritWord, {
          foreignKey: 'sanskritWordId',
        });

      },

    },

    hooks: {
      beforeCreate: function beforeCreate(instance) {

      },

      beforeUpdate: function beforeUpdate(instance) {

      },
    },
  });

  return SWordsPratyaya;
}

