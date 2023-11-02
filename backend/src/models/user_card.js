'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }

  UserCard.init({
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    card_id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Cards",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }
  }, {
    sequelize,
  });

  return UserCard;
};