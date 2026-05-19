const express = require("express");
const Comment = require("../models/Comment");
const commentController = require("../controllers/commentController");
const verifyToken = require("../middlewares/verifyToken");
const validateRequest = require("../middlewares/validateRequest");
const ownershipGuard = require("../middlewares/ownershipGuard");
const {
    commentCreateValidation,
    commentUpdateValidation,
} = require("../validations/commentValidation");

const router = express.Router();

router.post("/", verifyToken, commentCreateValidation, validateRequest, commentController.createComment);
router.get("/:ideaId", commentController.getCommentsByIdeaId);
router.patch(
    "/:id",
    verifyToken,
    ownershipGuard(Comment, "userEmail"),
    commentUpdateValidation,
    validateRequest,
    commentController.updateComment
);
router.delete("/:id", verifyToken, ownershipGuard(Comment, "userEmail"), commentController.deleteComment);

module.exports = router;