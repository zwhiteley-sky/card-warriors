const { Error, BAD_MESSAGE } = require("./message");
const { verify_token } = require("../auth");
const { AUTH_REQUIRED, BAD_REQUEST } = require("../errors");
const { compare_cards } = require("./utils");
const { User, Card } = require("../models");

// I really dislike dynamically typed languages
class GameManager {
    constructor() {
        this.games = new Map();
    }

    /**
     * Retrieve the list of open games, including the id 
     * of the host (so users can join the games) and the
     * cards the host has put at stake.
     */
    get open_games() {
        return Object.values(this.games).map(obj => {
            return {
                host_id: obj.host_id,
                cards: obj.host_cards
            };
        });
    }

    // NOTE: whilst this websocket use case may seem a bit
    // overkill, it's current design is only meant to meet
    // the MVP -- the final design would be to have users
    // select two cards and have them fight against each other,
    // but a simple system like this will do for an MVP.

    /**
     * Handle a websocket request to start hosting a game.
     * @param {import("ws").WebSocket} host_ws - The host websocket.
     */
    host(host_ws) {
        host_ws.once("message", async (msg) => {
            try {
                msg = JSON.parse(msg);
            } catch {
                host_ws.send(Error(
                    BAD_MESSAGE,
                    "invalid message"
                ));
                host_ws.close();
                return;
            }

            const user_id = verify_token(msg.token);

            if (!user_id) {
                host_ws.send(Error(
                    AUTH_REQUIRED,
                    "you need to be logged in to host"
                ));
                host_ws.close();
                return;
            }

            if (this.games[user_id.toString()]) {
                host_ws.send(Error(
                    BAD_REQUEST,
                    "you are already hosting a game!"
                ));
                host_ws.close();
                return;
            }

            if (!(msg.cards instanceof Array)) {
                host_ws.send(Error(
                    BAD_REQUEST,
                    "cards must be a list of card ids you own"
                ));
                host_ws.close();
                return;
            }

            const cards = await Card.findAll({
                where: {
                    id: msg.cards
                },
                include: {
                    model: User,
                    where: { id: user_id },
                    attributes: []
                }
            });

            if (cards.length !== 3) {
                host_ws.send(Error(
                    BAD_REQUEST,
                    "exactly three valid cards must be provided"
                ));
                host_ws.close();
                return;
            }

            this.games[user_id.toString()] = {
                host_id: user_id,
                host_ws,
                host_cards: cards
            };

            host_ws.on("close", () => {
                delete this.games[user_id.toString()];
            });
        });
    }

    /**
     * Handle a websocket request to join a game.
     * @param {import("ws").WebSocket} join_ws - The websocket of the joiner.
     */
    join(join_ws) {
        join_ws.once("message", async (msg) => {
            // Parse the message
            try {
                msg = JSON.parse(msg);
            } catch {
                join_ws.send(Error(
                    BAD_MESSAGE,
                    "invalid message"
                ));
                join_ws.close();
                return;
            }

            // Verify the token 
            const user_id = verify_token(msg.token);

            // If the token was invalid, ignore the
            // request
            if (!user_id) {
                join_ws.send(Error(
                    AUTH_REQUIRED,
                    "you need to be logged in to host"
                ));
                join_ws.close();
                return;
            }

            // If the host_id is invalid, ignore the request
            if (!msg.host_id || !this.games[msg.host_id.toString()]) {
                join_ws.send(Error(
                    BAD_REQUEST,
                    "game does not exist"
                ));
                join_ws.close();
                return;
            }

            if (!(msg.cards instanceof Array)) {
                join_ws.send(Error(
                    BAD_REQUEST,
                    "cards must be a list of card ids you own"
                ));
                join_ws.close();
                return;
            }

            // Retrieve the 3 cards the joiner has selected
            // to play with
            const join_cards = await Card.findAll({
                where: {
                    id: msg.cards
                },
                include: {
                    model: User,
                    where: { id: user_id },
                    attributes: []
                }
            });

            // If the joiner has not selected 3 cards, or they
            // do not have the cards they have selected, ignore
            // them
            if (join_cards.length !== 3) {
                join_ws.send(Error(
                    BAD_REQUEST,
                    "exactly three valid cards must be provided"
                ));
                join_ws.close();
                return;
            }

            // Play the game
            // Get the 3 cards the host decided to play with

            let host_cards;
            let host_ws;
            try {
                // NOTE: it is possible that a second player
                // joins the game whilst the first one is having
                // there three cards retrieved in the await
                // call above: this try block ensures that,
                // should such a rare event occur, it will
                // not crash the server and instead will be
                // handled gracefully
                let { 
                    host_cards: h_cards,
                    host_ws: h_ws
                } = this.games[msg.host_id.toString()];
                host_cards = h_cards;
                host_ws = h_ws;
            } catch {
                join_ws.send(Error(
                    BAD_REQUEST,
                    "the game no longer exists"
                ));
                join_ws.close();
                return;
            }
            
            // The game is no longer play-able 
            delete this.games[msg.host_id.toString()];

            // Compare the cards to determine the result
            const result = compare_cards(host_cards, join_cards);

            // Retrieve the host and join users
            const host_user = await User.findByPk(msg.host_id);
            const join_user = await User.findByPk(user_id);

            // If the host won, they get the joiner's three
            // cards
            if (result === "host") {
                await host_user.addCards(join_cards);
                await join_user.removeCards(join_cards);
            } else if (result === "join") {
                // If the joiner won, they get the host's three
                // cards
                await join_user.addCards(host_cards);
                await host_user.removeCards(host_cards);
            }

            // Send the result to both parties
            host_ws.send(JSON.stringify({
                winner: result
            }));
            join_ws.send(JSON.stringify({
                winner: result
            }));

            // Close the connections
            host_ws.close();
            join_ws.close();
        });
    }
}


module.exports = {
    GameManager,
};