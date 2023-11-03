const BAD_MESSAGE = 0;
const AUTH_REQUIRED = 1;

function Error(code, message) {
    return JSON.stringify({ code, message });
}

module.exports = {
    Error,
    BAD_MESSAGE,
    AUTH_REQUIRED
};