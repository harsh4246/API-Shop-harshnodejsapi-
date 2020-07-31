const Order=require('../models/order');
const Product=require('../models/product');
const mongoose=require('mongoose');


exports.orders_get_all=(req,res,next)=>{
    Order.find({user:req.userData.email})
    .populate('product')
    .exec()
    .then((docs) => {

        res.status(200).json({
            count: docs.length,
            orders:docs.map(doc=>{
                return {
                    _id:doc._id,
                    product:doc.product,
                    user:doc.email,
                    quantity:doc.quantity,
                    requests:{
                        type:'GET',
                        url: 'http://localhost:3000/orders/'+ doc._id
                    }
                }
            })
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });

}


exports.orders_create_one=(req,res,next)=>{

    Product.findById(req.body.productId)
    .then(Product=>{

        if (!Product){
            return res.status(404).json({
                message:'product not found'
            })
        }
        const order=new Order({
            _id:mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId,
            user:req.userData.email 
        });


        return order.save();})

        .then((result) => {

            res.status(201).json({
                count: result.length,
                orders:{

                        _id:result._id,
                        product:result.product,
                        quantity:result.quantity,
                        user:req.userData.email,
                        requests:{
                            type:'GET',
                            url: 'http://localhost:3000/orders/'+ result._id
                        }
                    }


        })

    })

    .catch((err) => {
        console.log(err);
        res/status(500).json(err);
    });




}

exports.orders_get_order=(req,res,next)=>{
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(result=>{

        if (!result){
            return res.status(404).json({
                message:"no order placed with this ID"
            })
        }

       return res.status(200).json({
            message: 'orders details',
            orderId: req.params.orderId,
            orderDetails:result
        });
    })
    .catch(err=>{
        res.status(500).json(err);
    })
}

exports.orders_delete_order=(req,res,next)=>{


    Order.remove({_id: req.params.orderId}).then(result=>{
        res.status(200).json(result)
    })
}


exports.orders_create_one_info=(req,res,next)=>{
    res.status(200).json({
        quantity: 'quantity',
        productId: 'productId'
    })
}