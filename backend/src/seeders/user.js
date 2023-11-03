module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                username: "zachary",
                email: "zachary@example.com",
                password_hash: "$2a$12$Xc2NJxpfi0czE9JnZkOBL.uTARZCsEjYOUbt/YXy1JFAEuQFzbjFW"
            },
            {
                username: "jordan",
                email: "jordan@example.com",
                password_hash: "$2a$12$Xc2NJxpfi0czE9JnZkOBL.uTARZCsEjYOUbt/YXy1JFAEuQFzbjFW"
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};