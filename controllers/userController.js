const User = require('../models/User');
const sendResponse = require('../utils/sendResponse');

// Get user profile
exports.getUserProfile = async(req, res) => {
    try {
        const userId = req.user && req.user.id;

        if (!userId) {
            return sendResponse(res, 401, false, 'Unauthorized access');
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        return sendResponse(res, 200, true, 'User profile retrieved', user);
    } catch (error) {
        return sendResponse(res, 500, false, 'Failed to get profile', null, error.message);
    }
};

// Update user profile
exports.updateUserProfile = async(req, res) => {
    try {
        const userId = req.user && req.user.id;
        const { name, photoURL } = req.body;

        if (!userId) {
            return sendResponse(res, 401, false, 'Unauthorized access');
        }

        const updatePayload = {};
        if (typeof name === 'string') updatePayload.name = name;
        if (typeof photoURL === 'string') updatePayload.photoURL = photoURL;

        const user = await User.findByIdAndUpdate(
            userId,
            updatePayload, { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        return sendResponse(res, 200, true, 'User profile updated', user);
    } catch (error) {
        return sendResponse(res, 500, false, 'Failed to update profile', null, error.message);
    }
};

// Delete user
exports.deleteUser = async(req, res) => {
    try {
        const userId = req.user && req.user.id;

        if (!userId) {
            return sendResponse(res, 401, false, 'Unauthorized access');
        }

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        return sendResponse(res, 200, true, 'User deleted successfully');
    } catch (error) {
        return sendResponse(res, 500, false, 'Failed to delete user', null, error.message);
    }
};