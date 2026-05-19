const Interaction = require("../models/Interaction");
const Idea = require("../models/Idea");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");

const getInteractionsByEmail = catchAsync(async(req, res) => {
    const interactions = await Interaction.find({ userEmail: req.params.email })
        .populate("ideaId", "title category creatorName createdAt")
        .sort({ createdAt: -1 })
        .lean();

    return sendResponse(res, 200, true, "Interactions fetched", interactions);
});

const addInteraction = catchAsync(async(req, res) => {
    const { ideaId, type } = req.body;
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

    const interaction = await Interaction.findOneAndUpdate({ userEmail: user.email, ideaId, type }, { userEmail: user.email, ideaId, type }, { upsert: true, new: true });

    if (type === "like") {
        const likesCount = await Interaction.countDocuments({ ideaId, type: "like" });
        await Idea.findByIdAndUpdate(ideaId, { likesCount });
    }

    return sendResponse(res, 201, true, "Interaction saved", interaction);
});

module.exports = {
    getInteractionsByEmail,
    addInteraction,
};