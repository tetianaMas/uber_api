const express = require('express');
const router = new express.Router();
const {async} = require('./helpers');
const validation = require('./middleWares/validationMiddleware');
const authController = require('../controllers/authController');
const {auth} = require('./middleWares/authMiddleware');

router.post('/register',
    async(validation.validateRegistr),
    async(authController.registr));

router.post('/login',
    async(validation.validateLogin),
    async(authController.login));

router.post('/forgot_password',
    async(auth),
    async(validation.email),
    async(authController.resetPassword));

module.exports = router;
