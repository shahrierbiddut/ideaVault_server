const { validationResult } = require("express-validator");
const sendResponse = require("../utils/sendResponse");

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return sendResponse(res, 400, false, "Validation failed", null, errors.array());
    }

    return next();
};

module.exports = validateRequest;