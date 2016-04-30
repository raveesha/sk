'use strict';

module.exports = function(sequelize, DataTypes) {
  var KannadaWord = sequelize.define('KannadaWord', {
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
    tableName: 'kannada_words',


    instanceMethods: {

    },

    classMethods: {
      associate: function associate(models) {
        // KannadaWord.belongsToMany(models.SanskritWord, {
        //   through: {
        //     model: models.SanskritKannada,
        //     unique: true,
        //   },
        //   foreignKey: 'kannadaWordId',
        //   targetKey: 'sanskritWordId',
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

  return KannadaWord;
}

