const Idea = require("../models/Idea");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Interaction = require("../models/Interaction");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");
const { buildIdeaListQuery } = require("../services/queryBuilder");
const { getTrendingIdeas } = require("../services/trendingService");

const createIdea = catchAsync(async(req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return sendResponse(res, 404, false, "User not found");
    }

    const payload = {
        ...req.body,
        creatorEmail: user.email,
        creatorName: user.name,
        creatorPhoto: user.photoURL,
    };

    const idea = await Idea.create(payload);
    return sendResponse(res, 201, true, "Idea created successfully", idea);
});

const getIdeas = catchAsync(async(req, res) => {
    const total = await Idea.countDocuments();
    const filteredCount = await Idea.countDocuments({
        ...(req.query.search ? { title: { $regex: req.query.search, $options: "i" } } : {}),
        ...(req.query.category ? { category: req.query.category } : {}),
    });

    const features = buildIdeaListQuery(Idea.find().lean(), req.query);
    const ideas = await features.query;

    return sendResponse(res, 200, true, "Ideas fetched successfully", {
        items: ideas,
        meta: {
            total,
            filteredCount,
            page: features.paginationResult.page,
            limit: features.paginationResult.limit,
            totalPages: Math.ceil(filteredCount / features.paginationResult.limit) || 1,
        },
    });
});

const getTrending = catchAsync(async(req, res) => {
    const ideas = await getTrendingIdeas(6);
    return sendResponse(res, 200, true, "Trending ideas fetched", ideas);
});

const getIdeaById = catchAsync(async(req, res) => {
    const idea = await Idea.findById(req.params.id).lean();

    if (!idea) {
        return sendResponse(res, 404, false, "Idea not found");
    }

    return sendResponse(res, 200, true, "Idea fetched successfully", idea);
});

const getMyIdeasByEmail = catchAsync(async(req, res) => {
    const ideas = await Idea.find({ creatorEmail: req.params.email })
        .sort({ createdAt: -1 })
        .lean();

    return sendResponse(res, 200, true, "My ideas fetched", ideas);
});

const updateIdea = catchAsync(async(req, res) => {
    const idea = req.resource;
    Object.assign(idea, req.body);
    await idea.save();
    return sendResponse(res, 200, true, "Idea updated successfully", idea);
});

const deleteIdea = catchAsync(async(req, res) => {
    const idea = req.resource;
    await Promise.all([
        Idea.findByIdAndDelete(idea._id),
        Comment.deleteMany({ ideaId: idea._id }),
        Interaction.deleteMany({ ideaId: idea._id }),
    ]);

    return sendResponse(res, 200, true, "Idea deleted successfully");
});

module.exports = {
    createIdea,
    getIdeas,
    getTrending,
    getIdeaById,
    getMyIdeasByEmail,
    updateIdea,
    deleteIdea,
};