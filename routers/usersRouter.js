const express = require('express');
const usersRouter = new express.Router();
const {async} = require('./helpers');
const {auth} = require('./middleWares/authMiddleware');
const validate = require('./middleWares/validationMiddleware');
const {checkShipper} = require('./middleWares/checkShipperMiddleware');
const usersController = require('../controllers/usersController');

usersRouter.get('/me',
    async(auth),
    async(usersController.getUserInfo));

usersRouter.patch('/me/password',
    async(auth),
    async(validate.password),
    async(usersController.changePassword));

usersRouter.delete('/me',
    async(auth),
    checkShipper,
    async(usersController.deleteUser));

module.exports = usersRouter;
