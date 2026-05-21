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
        const { name, photoURL, bio } = req.body;

        if (!userId) {
            return sendResponse(res, 401, false, 'Unauthorized access');
        }

        const updatePayload = {};
        if (typeof name === 'string') updatePayload.name = name;
        if (typeof photoURL === 'string') updatePayload.photoURL = photoURL;
        if (typeof bio === 'string') updatePayload.bio = bio;

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

// Change user password (local auth only)
exports.changePassword = async(req, res) => {
    try {
        const userId = req.user && req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!userId) {
            return sendResponse(res, 401, false, 'Unauthorized access');
        }

        const user = await User.findById(userId).select('+password');
        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        // Only local auth users can change password
        if (user.provider !== 'local') {
            return sendResponse(res, 403, false, 'Password change not available for OAuth accounts');
        }

        // Verify current password
        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return sendResponse(res, 401, false, 'Current password is incorrect');
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return sendResponse(res, 200, true, 'Password changed successfully');
    } catch (error) {
        return sendResponse(res, 500, false, 'Failed to change password', null, error.message);
    }
};

// Delete user
exports.deleteUser = async(req, res) => {
    try {
        const userId = req.user && req.user.id;
        const { password } = req.body;

        if (!userId) {
            return sendResponse(res, 401, false, 'Unauthorized access');
        }

        const user = await User.findById(userId).select('+password');
        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        // Verify password for deletion
        if (user.password) {
            const bcrypt = require('bcryptjs');
            const isPasswordValid = await bcrypt.compare(password || '', user.password);
            if (!isPasswordValid) {
                return sendResponse(res, 401, false, 'Password is incorrect');
            }
        }

        await User.findByIdAndDelete(userId);
        return sendResponse(res, 200, true, 'User deleted successfully');
    } catch (error) {
        return sendResponse(res, 500, false, 'Failed to delete user', null, error.message);
    }
};