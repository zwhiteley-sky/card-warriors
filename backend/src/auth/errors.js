const { AUTH, create_error } = require("../errors");

/**
 * Create an authentication error response.
 */
const auth_error = create_error.bind(this, AUTH);

/**
 * The username the client is trying to register with is
 * already associated with another user.
 */
const USERNAME_TAKEN = 0;

/**
 * The email the client is trying to register with is
 * already associated with another user.
 */
const EMAIL_TAKEN = 1;

/**
 * Either the email or the password provided is incorrect.
 */
const INVALID_LOGIN = 2;

module.exports = {
    auth_error,
    USERNAME_TAKEN,
    EMAIL_TAKEN,
    INVALID_LOGIN
};