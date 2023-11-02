'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Card.belongsToMany(models.User, {
        through: models.UserCard,
        foreignKey: "card_id",
        otherKey: "user_id"
      });
    }
  }

  Card.init({
    name: DataTypes.STRING,
    rarity: DataTypes.ENUM("common", "uncommon", "rare", "epic", "legendary")
  }, {
    sequelize,
    // Needed to ensure associate names are correct -- for some reason
    // they are capitalised, which is an eyesore
    // e.g., to ensure it is `user.cards` not `user.Cards`
    name: {
      singular: "card",
      plural: "cards"
    }
  });

  return Card;
};