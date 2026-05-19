const express = require("express");
const Idea = require("../models/Idea");
const verifyToken = require("../middlewares/verifyToken");
const validateRequest = require("../middlewares/validateRequest");
const ownershipGuard = require("../middlewares/ownershipGuard");
const ideaController = require("../controllers/ideaController");
const {
    ideaCreateValidation,
    ideaUpdateValidation,
    ideaQueryValidation,
} = require("../validations/ideaValidation");

const router = express.Router();

router.post("/", verifyToken, ideaCreateValidation, validateRequest, ideaController.createIdea);
router.get("/", ideaQueryValidation, validateRequest, ideaController.getIdeas);
router.get("/trending", ideaController.getTrending);
router.get("/my-ideas/:email", verifyToken, ideaController.getMyIdeasByEmail);
router.get("/:id", ideaController.getIdeaById);
router.patch(
    "/:id",
    verifyToken,
    ownershipGuard(Idea, "creatorEmail"),
    ideaUpdateValidation,
    validateRequest,
    ideaController.updateIdea
);
router.delete("/:id", verifyToken, ownershipGuard(Idea, "creatorEmail"), ideaController.deleteIdea);

module.exports = router;