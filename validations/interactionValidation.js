const { body } = require("express-validator");

const interactionValidation = [
    body("ideaId").isMongoId().withMessage("Valid ideaId is required"),
    body("type")
    .isIn(["comment", "bookmark", "like"])
    .withMessage("type must be one of comment, bookmark, like"),
];

module.exports = { interactionValidation };