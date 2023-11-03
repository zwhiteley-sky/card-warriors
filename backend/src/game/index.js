const { WebSocketServer } = require("ws");
const { GameManager } = require("./game_manager");
const express = require("express");
const url = require("url");

const games = new GameManager();

const game_router = express.Router();

game_router.get("/", (req, res) => {
    res.status(200).send(games.open_games);
});

/**
 * Add the websocket endpoint to an HTTP server.
 * @param {import('http').Server} server - The server.
 */
function add_game_ws(server) {
    const host_wss = new WebSocketServer({ 
        noServer: true,
        path: "/game/host"
    });

    const join_wss = new WebSocketServer({
        noServer: true,
        path: "/game/join"
    });

    server.on("upgrade", (request, socket, head) => {
        const path = url.parse(request.url).path;
        socket.on("error", console.error);

        if (path === "/game/host") {
            host_wss.handleUpgrade(request, socket, head, (ws) => {
                host_wss.emit("connection", ws);
            });
        } else {
            join_wss.handleUpgrade(request, socket, head, (ws) => {
                join_wss.emit("connection", ws);
            });
        }
    });

    host_wss.on("connection", (ws) => {
        games.host(ws);
    });

    join_wss.on("connection", (ws) => {
        games.join(ws);
    });
}

module.exports = { add_game_ws, game_router };