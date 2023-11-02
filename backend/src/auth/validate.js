const { bad_request } = require("../errors");

const USERNAME_REGEX = /^[\w-]{2,10}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

/**
 * Validates the body sent in a post request to /login.
 * @param {*} body - The body of the request
 * @returns The error, if applicable.
 */
function validate_login(body) {
    if (typeof body.email !== "string") {
        return bad_request("email", "missing field");
    }

    if (!EMAIL_REGEX.test(body.email)) {
        return bad_request("email", "invalid email");
    }

    if (typeof body.password !== "string") {
        return bad_request("password", "missing field");
    }
}

/**
 * Validates the body sent in a post request to /register.
 * @param {*} body - The body of the request
 * @returns The error, if applicable.
 */
function validate_register(body) {
    if (typeof body.username !== "string") {
        return bad_request("username", "missing field");
    }

    if (body.username.length < 2) {
        return bad_request(
            "username", 
            "must be at least 2 characters long"
        );
    }

    if (body.username.length > 10) {
        return bad_request(
            "username", 
            "must not be longer than 10 characters"
        );
    }

    if (!USERNAME_REGEX.test(body.username)) {
        return bad_request(
            "username",
            "username must only be formed of alphanumeric characters"
        );
    }

    if (typeof body.email !== "string") {
        return bad_request("email", "missing field");
    }

    if (!EMAIL_REGEX.test(body.email)) {
        return bad_request("email", "invalid email")
    }

    if (typeof body.password !== "string") {
        return bad_request("password", "missing field");
    }
}

module.exports = {
    validate_login,
    validate_register
}