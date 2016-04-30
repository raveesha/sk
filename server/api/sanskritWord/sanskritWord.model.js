'use strict';

module.exports = function(sequelize, DataTypes) {
  var SanskritWord = sequelize.define('SanskritWord', {
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
    tableName: 'sanskrit_words',


    instanceMethods: {

    },

    classMethods: {
      associate: function associate(models) {

        SanskritWord.belongsToMany(models.KannadaWord, {
          through: {
            model: models.SanskritKannada,
            unique: true,
          },
          foreignKey: 'sanskritWordId',
          targetKey: 'kannadaWordId',
        });

        SanskritWord.belongsToMany(models.SanskritPratyaya, {
          through: {
            model: models.SWordsPratyaya,
            unique: false,
          },
          foreignKey: 'sanskritWordId',
          targetKey: 'sanskritPratyayaId',
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

  return SanskritWord;
}

