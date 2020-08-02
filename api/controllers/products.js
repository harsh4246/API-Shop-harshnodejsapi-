const Product=require('../models/product');
const mongoose=require('mongoose');

exports.products_get_all=(req,res,next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs=>{

        if (docs){
            const response={
                count:docs.length,
                user:req.userData.email,
                products:docs.map(doc=>{
                    return{
                        name:doc.name,
                        _id:doc._id,
                        price:doc.price,
                        productImage:doc.productImage,
                        
                    }
                })

            };
            res.status(200).json(response);
        }
        else{
            res.status(404).json({message:"product not found"});
        }
    })
    .catch(err=>{
        
        res.status(500).json({error:err});
    })
}


exports.products_create_one=(req,res,next)=>{

    
    const product=new Product({
        _id:new mongoose.Types.ObjectId,
        name:req.body.name,
        price:req.body.price,
        productImage: req.file.path,
        productDescription:req.body.productDescription
    });

    product.save().then(result=>{
        
        res.status(201).json({
            
            createdProduct: result
        });
    }).catch(err=>{
        
        res.status(500).json({
            error:err
        });
    });


}


exports.products_get_one=(req,res,next)=>{
    const id=req.params.productId;
    Product.findById(id).exec()
    .then(doc=>{
        
        if (doc){
            res.status(200).json({
                product:doc,
                user:req.userData.email
            });
        }
        else{
            res.status(404).json({message:"product not found"});
        }
    })
    .catch(err=>{
        
        res.status(500).json({error:err});
    })
}

exports.products_edit_one=(req,res,next)=>{
    const id=req.params.productId;
    const upDateOps={};
    for(const ops of req.body){
        upDateOps[ops.propName] = ops.value;
    }
    Product.update({_id:id},{$set:upDateOps}).exec().then(result=>{
        
        res.status(200).json(result);
    })
    .catch(err=>{
        
        res.status(500).json({error:err});
    });
}

exports.products_delete_one=(req,res,next)=>{
    const id=req.params.productId;
    Product.remove({_id:id}).exec().then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        
        res.status(500).json({error:err});
    });
}

exports.products_post_info=(req,res,next)=>{
    res.status(200).json({
        imp_info:'use form data to submit this info',
        name:'product name here',
        price:'product price here',
        productImage: 'product img file jpeg or png here'
    })
}

exports.products_patch_info=(req,res,next)=>{
    res.status(200).json({

        imp_info:'you can use any of the fields and omit others listed below',
        name:'product name here',
        price:'product price here'
        
    })
}