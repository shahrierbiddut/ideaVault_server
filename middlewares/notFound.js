const sendResponse = require("../utils/sendResponse");

const notFound = (req, res) => {
    return sendResponse(res, 404, false, "Route not found", null, `${req.method} ${req.originalUrl}`);
};

module.exports = notFound;