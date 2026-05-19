const express = require("express");
const interactionController = require("../controllers/interactionController");
const verifyToken = require("../middlewares/verifyToken");
const validateRequest = require("../middlewares/validateRequest");
const { interactionValidation } = require("../validations/interactionValidation");

const router = express.Router();

router.get("/:email", verifyToken, interactionController.getInteractionsByEmail);
router.post("/", verifyToken, interactionValidation, validateRequest, interactionController.addInteraction);

module.exports = router;