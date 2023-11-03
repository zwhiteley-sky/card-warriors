const { UniqueConstraintError } = require("sequelize");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth_router = express.Router();
const { User } = require("../models");
const { auth_error, USERNAME_TAKEN, EMAIL_TAKEN, INVALID_LOGIN } = require("./errors");
const { validate_login, validate_register } = require("./validate");

auth_router.post("/login", async (req, res) => {
    const body = req.body;
    const validation_error = validate_login(body);

    if (validation_error) {
        res.status(400).send(validation_error);
        return;
    }

    // Note: the uniqueness guarantee ensures there will be
    // at most one user with this email
    const user = await User.findOne({
        where: {
            email: body.email
        }
    });

    // If the user does not exist, return an error
    if (!user) {
        res.status(401)
            .send(auth_error(
                INVALID_LOGIN,
                "invalid email or password"
            ));

        return;
    }

    // Check the hash of the user's password matches the
    // stored hash
    if (!await bcrypt.compare(body.password, user.password_hash)) {
        res.status(401)
            .send(auth_error(
                INVALID_LOGIN,
                "invalid email or password"
            ));

        return;
    }

    // Generate JWT
    // A JWT is a self-contained token signed by a secret
    // stored on the server -- we can then validate this
    // secret later to authenticate the user
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    }, Buffer.from(process.env.JWT_KEY, "base64"), {
        expiresIn: "24h"
    });

    res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        token
    });
});

auth_router.post("/register", async (req, res) => {
    const body = req.body;

    // Validate the format of the body
    const validation_error = validate_register(body);
    if (validation_error) {
        res.status(400).send(validation_error);
        return;
    }
    
    try {
        const user = await User.create({
            username: body.username,
            email: body.email,
            
            // Hash the password to minimise damage caused
            // by database breaches
            // NOTE: bcrypt handles salt generation
            // automatically, and stores it as part of the
            // generated hash, so we don't need to.
            password_hash: await bcrypt.hash(body.password, 12)
        });

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        // If the email/username was not unique
        if (error instanceof UniqueConstraintError) {
            if (!error.fields) throw error;

            if (error.fields[0] === "username") {
                res.status(400)
                    .send(auth_error(
                        USERNAME_TAKEN,
                            `username ${body.username} taken`
                        ));
            } else if (error.fields[0] === "email") {
                res.status(400)
                    .send(auth_error(
                        EMAIL_TAKEN,
                            `email ${body.email} taken`
                        ));
            } else throw error;

            return;
        }

        throw error;
    }
});

/**
 * Verify an authentication token.
 * @param {string} token - The token to be verified.
 * @returns The user id, if applicable.
 */
function verify_token(token) {
    try {
        if (token) {
            const payload = jwt.verify(token, Buffer.from(process.env.JWT_KEY, "base64"));
            return payload.id;
        }
    } catch {
        return undefined;
    }
}

/**
 * Handle and validate the `Authorization` header on requests
 * (extracting the user id in the process).
 * 
 * This allows handlers further in the chain to authenticate
 * the user without having to validate the JWT themselves.
 * @param {import("express").Request} req - The request.
 * @param {import("express").Response} _  - The response.
 */
function token_handler(req, _, next) {
    const token = req.headers["authorization"];

    const user_id = verify_token(token);
    if (user_id) req.user_id = user_id;
    next();
}

module.exports = { 
    auth_router,
    verify_token,
    token_handler
};