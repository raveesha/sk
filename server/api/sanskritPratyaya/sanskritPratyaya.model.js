'use strict';

module.exports = function(sequelize, DataTypes) {
  var SanskritPratyaya = sequelize.define('SanskritPratyaya', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: DataTypes.STRING
    // word: DataTypes.STRING(100),
    // gender:DataTypes.STRING(100),
    // kan_meaning:DataTypes.STRING(100),
    // San_meaning:DataTypes.STRING(100),
    // Book_ref:DataTypes.STRING(100),
    // Vyutpatti:DataTypes.STRING(100),
    // Ashtadhyayi_Sutra_Ref:DataTypes.STRING(100),
  }, {
    tableName: 'sanskrit_pratyayas',


    instanceMethods: {

    },

    classMethods: {
      associate: function associate(models) {

        // SanskritPratyaya.belongsToMany(models.KannadaWord, {
        //   through: {
        //     model: models.SanskritKannada,
        //     unique: true,
        //   },
        //   foreignKey: 'SanskritPratyayaId',
        //   targetKey: 'kannadaWordId',
        // });
      },

    },

    hooks: {
      beforeCreate: function beforeCreate(instance) {

      },

      beforeUpdate: function beforeUpdate(instance) {

      },
    },
  });

  return SanskritPratyaya;
}

