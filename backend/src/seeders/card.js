module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Cards', [
            {
                name: "Shrek",
                rarity: "rare"
            },
            {
                name: "Lord Farquaad",
                rarity: "epic"
            },
            {
                name: "Generic",
                rarity: "common"
            },
            {
                name: "Cheesecake",
                rarity: "legendary"
            },
            {
                name: "France",
                rarity: "uncommon"
            },
            {
                name: "Gingerbread Man",
                rarity: "common"
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Cards', null, {});
    }
};