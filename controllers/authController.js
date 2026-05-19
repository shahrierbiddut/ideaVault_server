const bcrypt = require("bcryptjs");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");
const generateToken = require("../utils/generateToken");
const initFirebaseAdmin = require("../config/firebaseAdmin");

const sendDuplicateKeyError = (res, error) => {
    const duplicateField = Object.keys(error?.keyPattern || {})[0] || "field";
    return sendResponse(res, 409, false, `${duplicateField} already exists`);
};

const sanitizeUser = (userDoc) => {
    const user = userDoc.toObject ? userDoc.toObject() : userDoc;
    delete user.password;
    return user;
};

const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const register = catchAsync(async(req, res) => {
    const { name, email, password, photoURL } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return sendResponse(res, 409, false, "Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    try {
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            photoURL: photoURL || "",
            provider: "local",
        });
    } catch (error) {
        if (error?.code === 11000) {
            return sendDuplicateKeyError(res, error);
        }
        throw error;
    }

    const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });

    setAuthCookie(res, token);

    return sendResponse(res, 201, true, "User registered successfully", {
        token,
        user: sanitizeUser(user),
    });
});

const login = catchAsync(async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
        return sendResponse(res, 401, false, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return sendResponse(res, 401, false, "Invalid email or password");
    }

    const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });

    setAuthCookie(res, token);

    return sendResponse(res, 200, true, "Login successful", {
        token,
        user: sanitizeUser(user),
    });
});

const googleLogin = catchAsync(async(req, res) => {
    const { idToken } = req.body;
    const admin = initFirebaseAdmin();

    if (!admin) {
        return sendResponse(
            res,
            500,
            false,
            "Firebase admin not configured",
            null,
            "Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY"
        );
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const email = decoded.email;
    const name = decoded.name || email;
    const photoURL = decoded.picture || "";

    let user = await User.findOne({ email });
    if (!user) {
        try {
            user = await User.create({
                name,
                email,
                photoURL,
                provider: "google",
            });
        } catch (error) {
            if (error?.code === 11000) {
                return sendDuplicateKeyError(res, error);
            }
            throw error;
        }
    }

    const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });

    setAuthCookie(res, token);

    return sendResponse(res, 200, true, "Google login successful", {
        token,
        user: sanitizeUser(user),
    });
});

const getMe = catchAsync(async(req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(res, 200, true, "User profile fetched", sanitizeUser(user));
});

const logout = catchAsync(async(req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return sendResponse(res, 200, true, "Logout successful");
});

module.exports = {
    register,
    login,
    googleLogin,
    getMe,
    logout,
};