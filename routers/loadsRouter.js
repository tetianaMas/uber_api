const express = require('express');
const loadsRouter = new express.Router();
const {async} = require('./helpers');
const {auth} = require('./middleWares/authMiddleware');
const {checkDriver} = require('./middleWares/checkDriverMiddleware');
const {checkShipper} = require('./middleWares/checkShipperMiddleware');
const validation = require('./middleWares/validationMiddleware');
const loadsController = require('../controllers/loadsController');

loadsRouter.get('/',
    async(auth),
    async(loadsController.getLoads));

loadsRouter.post('/',
    async(auth),
    checkShipper,
    async(validation.load),
    async(loadsController.addLoad));

loadsRouter.get('/active',
    async(auth),
    checkDriver,
    async(loadsController.getActive));

loadsRouter.patch('/active/state',
    async(auth),
    checkDriver,
    async(loadsController.patchState));

loadsRouter.get('/:id',
    async(auth),
    async(validation.id),
    async(loadsController.getLoadById));

loadsRouter.put('/:id',
    async(auth),
    async(validation.id),
    checkShipper,
    async(loadsController.putLoad));

loadsRouter.delete('/:id',
    async(auth),
    async(validation.id),
    checkShipper,
    async(loadsController.deleteLoad));

loadsRouter.get('/:id/shipping_info',
    async(auth),
    async(validation.id),
    checkShipper,
    async(loadsController.getInfo));

loadsRouter.post('/:id/post',
    async(auth),
    checkShipper,
    async(validation.id),
    async(loadsController.postLoad));

module.exports = loadsRouter;
