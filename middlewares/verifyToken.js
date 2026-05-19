const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const tokenFromHeader = authHeader.startsWith("Bearer ") ?
        authHeader.split(" ")[1] :
        null;
    const token = tokenFromHeader || (req.cookies ? req.cookies.token : null);

    if (!token) {
        return sendResponse(res, 401, false, "Unauthorized access", null, "Token missing");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        return sendResponse(res, 401, false, "Unauthorized access", null, "Invalid or expired token");
    }
};

module.exports = verifyToken;