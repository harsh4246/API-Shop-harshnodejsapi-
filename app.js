const express=require('express');
const app=express(); //made app as a express function
const morgan = require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://harsh:'+process.env.MONGO_ATLAS_PW+'@node-rest-shop.fut5s.mongodb.net/node-rest-shop?retryWrites=true&w=majority',{
    useUnifiedTopology: true, useNewUrlParser: true
})

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',"Origin,X-Requested-With,Content-Type,Accept,Authorization");
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

const productRoutes=require('./api/routes/products');
const ordersRoutes=require('./api/routes/orders');
const userRoutes=require('./api/routes/users');
//const nodemon = require('nodemon');

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use('/profilePic',express.static('profilePic'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/products',productRoutes);//kind of a filter
app.use('/orders',ordersRoutes);
app.use('/users',userRoutes);

app.use((req,res,next)=>{
    const error=new Error('not found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports=app;
