'use strict';

module.exports = function(sequelize, DataTypes) {
  var SanskritKannada = sequelize.define('SanskritKannada', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'sanskrit_kannada',


    instanceMethods: {

    },

    classMethods: {
      associate: function associate(models) {
       /* SanskritKannada.belongsTo(models.KannadaWord, {
          foreignKey: 'kannadaWordId',
        });

        SanskritKannada.belongsTo(models.SanskritWord, {
          foreignKey: 'sanskritWordId',
        });*/

      },

    },

    hooks: {
      beforeCreate: function beforeCreate(instance) {

      },

      beforeUpdate: function beforeUpdate(instance) {

      },
    },
  });

  return SanskritKannada;
}

