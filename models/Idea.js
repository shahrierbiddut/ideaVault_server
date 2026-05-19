const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, index: true },
    shortDescription: { type: String, required: true, trim: true },
    detailedDescription: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    tags: { type: [String], default: [] },
    imageURL: { type: String, default: "" },
    estimatedBudget: { type: String, default: "" },
    targetAudience: { type: String, default: "" },
    problemStatement: { type: String, default: "" },
    proposedSolution: { type: String, default: "" },
    creatorEmail: { type: String, required: true, index: true },
    creatorName: { type: String, required: true },
    creatorPhoto: { type: String, default: "" },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    trendingScore: { type: Number, default: 0, index: true },
}, { timestamps: true });

ideaSchema.index({ title: "text", shortDescription: "text", detailedDescription: "text" });

module.exports = mongoose.model("Idea", ideaSchema);