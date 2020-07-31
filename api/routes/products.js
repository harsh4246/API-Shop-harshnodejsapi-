const express= require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Product=require('../models/product');
const multer=require('multer');
const checkAuth=require('../middleware-auth/checkAuth');
const productsController=require('../controllers/products');
const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){

        cb(null,Date.now()+file.originalname);
    }
})




const upload=multer({

    storage:storage,

    limits:{
        fileSize: 1024*1024*5
    },

    fileFilter:function(req,file,cb){
        if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
            console.log('file is clean');
            cb(null, true);
        }
        else{
            console.log('file is not clean');
            cb(null, false);
        }

    }

});




router.get('/',productsController.products_get_all);

router.post('/',checkAuth,upload.single('productImage'),productsController.products_create_one);

router.get('/info',productsController.products_post_info);

router.get('/:productId',productsController.products_get_one);

router.patch('/:productId',checkAuth,productsController.products_edit_one);

router.get('/:productId/info',productsController.products_patch_info);

router.delete('/:productId',checkAuth,productsController.products_delete_one);

module.exports=router;