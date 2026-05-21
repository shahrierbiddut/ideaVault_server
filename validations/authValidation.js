const { body } = require("express-validator");

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

const registerValidation = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password")
    .matches(passwordRule)
    .withMessage("Password must be at least 6 chars with uppercase and lowercase"),
];

const loginValidation = [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
];

const googleValidation = [
    body("idToken").trim().notEmpty().withMessage("Firebase ID token is required"),
];

module.exports = {
    registerValidation,
    loginValidation,
    googleValidation,
};