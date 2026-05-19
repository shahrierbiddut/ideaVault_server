const sendResponse = require("../utils/sendResponse");

const ownershipGuard = (Model, ownerField) => {
    return async(req, res, next) => {
        const { id } = req.params;
        const document = await Model.findById(id);

        if (!document) {
            return sendResponse(res, 404, false, "Resource not found");
        }

        if (String(document[ownerField]) !== String(req.user.email)) {
            return sendResponse(res, 403, false, "Forbidden", null, "You do not own this resource");
        }

        req.resource = document;
        return next();
    };
};

module.exports = ownershipGuard;