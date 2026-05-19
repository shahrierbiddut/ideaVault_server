const { body } = require("express-validator");

const commentCreateValidation = [
    body("ideaId").isMongoId().withMessage("Valid ideaId is required"),
    body("commentText")
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage("commentText must be 1-300 characters"),
];

const commentUpdateValidation = [
    body("commentText")
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage("commentText must be 1-300 characters"),
];

module.exports = {
    commentCreateValidation,
    commentUpdateValidation,
};