const sendResponse = require("../utils/sendResponse");

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (err.name === "CastError") {
        return sendResponse(res, 400, false, "Invalid resource id", null, err.message);
    }

    if (err.code === 11000) {
        return sendResponse(res, 409, false, "Duplicate field value", null, err.message);
    }

    return sendResponse(
        res,
        statusCode,
        false,
        err.message || "Something went wrong",
        null,
        process.env.NODE_ENV === "production" ? undefined : err.stack
    );
};

module.exports = errorHandler;