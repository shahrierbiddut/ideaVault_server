const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        index: true,
    },
    ideaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea",
        required: true,
        index: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["comment", "bookmark", "like"],
    },
}, { timestamps: { createdAt: true, updatedAt: false } });

interactionSchema.index({ userEmail: 1, ideaId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Interaction", interactionSchema);