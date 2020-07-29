const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=require ('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const multer=require('multer');

const storage2=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./profilePic');
    },

    filename: function(req,file,cb){
        cb(null, Date.now()+file.originalname);
    }
})

const profilePic = multer({
    storage:storage2,
    limits:{
        fileSize: 1024*1024*5
    },
    fileFilter: function(req,file,cb){
        if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
            console.log('file is clean');
            cb(null, true);
        }
        else{
            console.log('file is not clean');
            cb(null, false);
        }
    }

})

const usersController=require('../controllers/users');
const checkAuth = require('../middleware-auth/checkAuth');


router.post('/signup',profilePic.single('profilePic'),usersController.users_signup);

router.post('/login',usersController.users_login)
router.get('/',(req,res,next)=>{
    User.find().then(result=>{
        res.status(200).json(result)
    })
    
})



router.delete('/:userId',usersController.users_delete)

module.exports=router;