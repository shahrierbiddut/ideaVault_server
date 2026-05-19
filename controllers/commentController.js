const Comment = require("../models/Comment");
const Idea = require("../models/Idea");
const Interaction = require("../models/Interaction");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");

const updateIdeaCommentStats = async(ideaId) => {
    const count = await Comment.countDocuments({ ideaId });
    await Idea.findByIdAndUpdate(ideaId, {
        commentsCount: count,
    });
};

const createComment = catchAsync(async(req, res) => {
    const { ideaId, commentText } = req.body;
    const [idea, user] = await Promise.all([
        Idea.findById(ideaId),
        User.findById(req.user.id),
    ]);

    if (!idea) {
        return sendResponse(res, 404, false, "Idea not found");
    }

    if (!user) {
        return sendResponse(res, 404, false, "User not found");
    }

    const comment = await Comment.create({
        ideaId,
        userEmail: user.email,
        userName: user.name,
        userPhoto: user.photoURL,
        commentText,
    });

    await Promise.all([
        updateIdeaCommentStats(ideaId),
        Interaction.findOneAndUpdate({ userEmail: user.email, ideaId, type: "comment" }, { userEmail: user.email, ideaId, type: "comment" }, { upsert: true, new: true }),
    ]);

    return sendResponse(res, 201, true, "Comment added successfully", comment);
});

const getCommentsByIdeaId = catchAsync(async(req, res) => {
    const comments = await Comment.find({ ideaId: req.params.ideaId })
        .sort({ createdAt: -1 })
        .lean();

    return sendResponse(res, 200, true, "Comments fetched", comments);
});

const updateComment = catchAsync(async(req, res) => {
    const comment = req.resource;
    comment.commentText = req.body.commentText;
    await comment.save();
    return sendResponse(res, 200, true, "Comment updated successfully", comment);
});

const deleteComment = catchAsync(async(req, res) => {
    const comment = req.resource;
    const ideaId = comment.ideaId;
    await Comment.findByIdAndDelete(comment._id);
    await updateIdeaCommentStats(ideaId);
    return sendResponse(res, 200, true, "Comment deleted successfully");
});

module.exports = {
    createComment,
    getCommentsByIdeaId,
    updateComment,
    deleteComment,
};