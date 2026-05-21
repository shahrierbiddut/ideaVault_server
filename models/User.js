const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    photoURL: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
        maxlength: 500,
    },
    password: {
        type: String,
        default: null,
        select: false,
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model("User", userSchema);