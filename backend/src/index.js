const express = require("express");
const proxy = require("express-http-proxy");
const app = express();

// Gateway (redirects all non API requests to NextJS)
app.use(proxy("http://localhost:3000", {
    filter: async (req, _) => {
        return !(req.subdomains.length === 1 && req.subdomains[0] === "api");
    }
}));

app.listen(4000);
