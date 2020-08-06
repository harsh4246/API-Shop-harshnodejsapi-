const express=require('express');
const mongoose=require('mongoose');
const checkAuth=require('../middleware-auth/checkAuth');
const ordersController=require('../controllers/orders');



const Order=require('../models/order');
const Product=require('../models/product');

const router=express.Router();

router.get('/Imharsh4246',checkAuth,ordersController.orders_get_all_Admin);

router.get('/',checkAuth,ordersController.orders_get_all);

router.post('/',checkAuth,ordersController.orders_create_one);

router.get('/',checkAuth,ordersController.orders_create_one_info);

router.get('/:orderId',checkAuth,ordersController.orders_get_order);

router.delete('/:orderId',checkAuth,ordersController.orders_delete_order);

module.exports=router;