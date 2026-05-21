const express = require('express');
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const { changePasswordValidation } = require('../validations/authValidation');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// User routes
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile', verifyToken, userController.updateUserProfile);
router.post('/change-password', verifyToken, changePasswordValidation, validateRequest, userController.changePassword);
router.delete('/profile', verifyToken, userController.deleteUser);

module.exports = router;