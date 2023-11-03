/**
 * A general error.
 */
const GENERAL = 0;

/**
 * An authentication-related error.
 */
const AUTH = 1;

/**
 * The request was malformed.
 */
const BAD_REQUEST = 0;

/**
 * You must be authenticated to make this request.
 */
const AUTH_REQUIRED = 1;

/**
 * Creates an error code from a primary error code (describing
 * from which "area" the error originates, e.g., authentication)
 * and a secondary error code (specifying what exactly went
 * wrong, e.g., the password was invalid).
 * 
 * The error code is derived by setting the upper half
 * (of a 32-bit integer) to the primary error code and
 * the lower half to the second code.
 * 
 * For example, an email taken authentication error code would be:
 *
 * 0000 0001 0000 0001
 * ^^^^^^^^^ ^^^^^^^^^
 * Primary   |
 *           Secondary
 * 
 * @param {number} primary - The primary error code.
 * @param {number} secondary - The secondary error code.
 * @returns {number} The combined error code.
 */
function create_code(primary, secondary) {
    return primary << 16 | secondary;
}

/**
 * Creates an error object to be returned by the API.
 * @param {number} primary - The primary error code.
 * @param {number} secondary - The secondary error code.
 * @param {string} message - The message of the error.
 * @returns The error object.
 */
function create_error(primary, secondary, message) {
    return {
        error_code: create_code(primary, secondary),
        error_message: message
    }
}

/**
 * Creates an error object where a malformed body has been
 * passed to the API.
 * @param {string} field - The name of the problem field.
 * @param {string} reason - The reason there's a problem.
 * @returns The error object.
 */
function bad_request(field, reason) {
    return create_error(
        GENERAL, 
        BAD_REQUEST,
        `${field}: ${reason}`
    );
}

module.exports = {
    create_code,
    create_error,
    bad_request,
    AUTH,
    GENERAL,
    BAD_REQUEST,
    AUTH_REQUIRED
};