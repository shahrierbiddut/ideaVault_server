const express = require("express");
const authController = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");
const validateRequest = require("../middlewares/validateRequest");
const {
    registerValidation,
    loginValidation,
    googleValidation,
} = require("../validations/authValidation");

const router = express.Router();

router.post("/register", registerValidation, validateRequest, authController.register);
router.post("/login", loginValidation, validateRequest, authController.login);
router.post("/google", googleValidation, validateRequest, authController.googleLogin);
router.get("/me", verifyToken, authController.getMe);
router.post("/logout", authController.logout);

module.exports = router;