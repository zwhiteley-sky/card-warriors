const express = require("express");
const card_router = express.Router();
const { User, Card } = require("../models");
const { create_error, GENERAL, AUTH_REQUIRED } = require("../errors");

card_router.get("/", async (req, res) => {
    const page = Number(req.query.page);

    if (isNaN(page)) page = 1;

    res.status(200)
        .send(await Card.findAll({
            limit: 5,
            offset: (page - 1) * 5
        }));
});

card_router.get("/my-cards", async (req, res) => {
    if (!req.user_id) {
        res.status(401)
            .send(create_error(
                GENERAL,
                AUTH_REQUIRED,
                "you need to be authenticated to make this request"
            ));
        
        return;
    }

    let page = Number(req.query.page);
    if (isNaN(page)) page = 1;

    const cards = await Card.findAll({
        include: {
            model: User,
            attributes: [],
            where: { id: req.user_id },
            through: { attributes: [] }
        },
        limit: 5,
        offset: (page - 1) * 5
    });

    res.status(200).send(cards);
});

module.exports = { card_router };