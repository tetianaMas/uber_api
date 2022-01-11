const express = require('express');
const trucksRouter = new express.Router();
const {async} = require('./helpers');
const {auth} = require('./middleWares/authMiddleware');
const {checkDriver} = require('./middleWares/checkDriverMiddleware');
const validate = require('./middleWares/validationMiddleware');
const trucksController = require('../controllers/trucksController');

trucksRouter.get('/',
    async(auth),
    checkDriver,
    async(trucksController.getTrucks));

trucksRouter.post('/',
    async(auth),
    checkDriver,
    async(validate.truck),
    async(trucksController.addTruck));

trucksRouter.get('/:id',
    async(auth),
    checkDriver,
    async(validate.id),
    async(trucksController.getTruck));

trucksRouter.put('/:id',
    async(auth),
    checkDriver,
    async(validate.id),
    async(trucksController.putTruck));

trucksRouter.delete('/:id',
    async(auth),
    checkDriver,
    async(validate.id),
    async(trucksController.remove));

trucksRouter.post('/:id/assign',
    async(auth),
    checkDriver,
    async(validate.id),
    async(trucksController.assign));

module.exports = trucksRouter;
