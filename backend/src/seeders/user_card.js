module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('UserCards', [
            // Zachary cards
            { user_id: 1, card_id: 1 },
            { user_id: 1, card_id: 2 },
            { user_id: 1, card_id: 3 },

            // Jordan cards
            { user_id: 2, card_id: 4 },
            { user_id: 2, card_id: 5 },
            { user_id: 2, card_id: 6 },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('UserCards', null, {});
    }
};
