const mongoose=require('mongoose');
const User=require ('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


exports.users_signup=(req,res,next)=>{

    User.find({email:req.body.email}).exec()
    .then(result=>{
        if(result.length>=1){
            return res.status(422).json({
                message:'Mail already exists'
            })
        }
        else{
            bcrypt.hash( req.body.password, 10,(err,hash)=>{


                if(err){
                    return res.status(500).json({
                        error:err
                    })

                }

                else{

                    const user=new User({
                    _id:mongoose.Types.ObjectId(),
                    email:req.body.email,
                    password:hash,
                    profilePic: req.file.path,
                    name:req.body.name

                    });

                    user.save()
                    .then(result=>{
                        console.log(result);
                        res.status(201).json({
                            message:'user created',
                            email:result.email,
                            profilePic: req.file.path,
                            further_steps: 'please go to the login page url provided and in body provide the info on the fields listed.',
                            url:'http://localhost:3000/users/login/',
                            user:result

                        })
                    })
                    .catch(err=>{
                        res.status(500).json(err);
                    })
                }
            })
        }
    })

}


exports.users_login=(req,res,next)=>{
    User.find({email:req.body.email}).exec()
    .then(result=>{

        if (result.length<1){
            return res.status(401).json({
                message: 'the user does not exist'
            })
        }

        else{


            bcrypt.compare(req.body.password,result[0].password,(err,response)=>{
                if(err){
                    return res.status(401).json({
                        message: 'the user does not exist'
                    })
                }

                if (response){
                   const token= jwt.sign({
                        email: result[0].email,
                        userId: result._id
                    },
                    "secretharsh",
                    {
                        expiresIn:'1h'
                    }
                    );



                    return res.status(200).json({
                        Success: 'true',
                        further_steps:'go to headers and set the key to \'Authorization\' and set value as the info given below',
                        key:'Authorization',
                        value:'Bearer '+token,
                        instructions: 'at any url just add \'\info\' to get to know how to use the api',


                        user: result[0],




                        useful_urls:{

                            get_all_products:'http://localhost:3000/products/',
                            products_get_one_details:'http://localhost:3000/products/:productId',
                            orders_get_all:'http://localhost:3000/orders/',
                            orders_create_one:'http://localhost:3000/orders/',
                            orders_get_order_details:'http://localhost:3000/orders/:orderId',
                            orders_delete_order:'http://localhost:3000/orders/:orderId'
                        }


                    })
                }

                else{
                    return res.status(401).json({
                        message: 'check your password'
                    })
                }
            })

            
        }


    })
    .catch(err=>{
        res.status(500).json(err)
    })
}


exports.users_delete=(req,res,next)=>{
    User.remove({_id:req.params.userId}).exec()
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err=>{
        res.status(500).json({
            message:'could not delete',
            error:err
        })
    })
}

