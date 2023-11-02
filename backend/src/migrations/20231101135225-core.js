'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password_hash: {
        type: Sequelize.STRING
      }
    });

    queryInterface.addIndex("Users", ["username"], {
      unique: true
    });

    queryInterface.addIndex("Users", ["email"], {
      unique: true
    });

    await queryInterface.createTable("Cards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      rarity: {
        type: Sequelize.ENUM("common", "uncommon", "rare", "epic", "legendary")
      }
    });

    await queryInterface.createTable("UserCards", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Users",
          key: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      card_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Cards",
          key: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserCards');
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Cards');
  }
};