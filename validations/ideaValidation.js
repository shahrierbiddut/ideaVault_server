const { body, query } = require("express-validator");

const ideaCreateValidation = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("shortDescription").trim().notEmpty().withMessage("Short description is required"),
    body("detailedDescription").trim().notEmpty().withMessage("Detailed description is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("imageURL").optional({ checkFalsy: true }).isURL().withMessage("imageURL must be a valid URL"),
    body("tags").optional().isArray().withMessage("tags must be an array"),
    body("estimatedBudget").optional().trim(),
    body("targetAudience").optional().trim(),
    body("problemStatement").optional().trim(),
    body("proposedSolution").optional().trim(),
];

const ideaUpdateValidation = [
    body("title").optional().trim().notEmpty(),
    body("shortDescription").optional().trim().notEmpty(),
    body("detailedDescription").optional().trim().notEmpty(),
    body("category").optional().trim().notEmpty(),
    body("imageURL").optional({ checkFalsy: true }).isURL().withMessage("imageURL must be a valid URL"),
    body("tags").optional().isArray().withMessage("tags must be an array"),
];

const ideaQueryValidation = [
    query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100"),
    query("sort").optional().isIn(["newest", "oldest", "popular", "commented"]),
    query("startDate").optional().isISO8601().withMessage("startDate must be a valid date"),
    query("endDate").optional().isISO8601().withMessage("endDate must be a valid date"),
];

module.exports = {
    ideaCreateValidation,
    ideaUpdateValidation,
    ideaQueryValidation,
};