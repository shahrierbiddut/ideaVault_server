const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    ideaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea",
        required: true,
        index: true,
    },
    userEmail: {
        type: String,
        required: true,
        index: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userPhoto: {
        type: String,
        default: "",
    },
    commentText: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
    },
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);