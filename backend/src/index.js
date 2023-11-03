const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "..", ".env")
});
const express = require("express");
const proxy = require("express-http-proxy");
const { auth_router, token_handler } = require("./auth");
const { card_router } = require("./card");
const app = express();

// Gateway (redirects all non API requests to NextJS)
app.use(proxy("http://localhost:3000", {
    filter: async (req, _) => {
        return !(req.subdomains.length === 1 && req.subdomains[0] === "api");
    }
}));

// Middleware
app.use(express.json());
app.use(token_handler);

// Routers
app.use("/auth", auth_router);
app.use("/card", card_router);

app.listen(4000);
