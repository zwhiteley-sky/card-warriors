'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Card, {
        through: models.UserCard,
        foreignKey: "user_id",
        otherKey: "card_id"
      });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password_hash: DataTypes.STRING
  }, {
    sequelize,
    // Needed to ensure associate names are correct -- for some reason
    // they are capitalised, which is an eyesore
    //
    // This occurs because the model name is also capitalised -- if 
    // we changed the model name such that it was not capitalised, it
    // would be exported with the non-capitalised name, which defeats
    // the point. IMO it was a poor decision to design it in such a way
    // whereby `init` actually changes the name of the class and uses
    // the rename to determine the association names. 
    name: {
      singular: "user",
      plural: "users"
    },
  });

  return User;
};