const express = require('express');
const bodyParser = require('body-parser');
const CartModel = require('../models/CartModel');
const OrderModel = require('../models/OrderModel');
const UserModel = require('../models/UserModel');
const async = require('async');


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

exports.addToCart = (req,res)=>{
    const book = { id: req.body._id, name: req.body.name, author: req.body.author, amount:req.body.amount, src: req.body.src, quantity: req.body.quantity };
    console.log("add to cart Body:",req.body,req.body._id);

    CartModel.findOne(
            {email: req.body.email, "books.id": req.body._id},
            {'books.$' : 1}
        ).then(data => {

        console.log("FIND DATA FROM CART MODEL:",data);
        
        if(data !=null)
        {
            let finalQuantity =  data.books[0].quantity + req.body.quantity
            console.log("Final Quantity",finalQuantity);
            
            CartModel.updateOne(
                {'books.id': data.books[0].id}, 
                {'$set': {'books.$.quantity': finalQuantity,}}, 
                function (error, success) {
                    if (error) {
                    console.log(error,"Add To Cart Error");

                        res.json({
                            status: 400,
                            message:'Error while adding in Cart',
                        });

                    } 
                    
                    else {
                        console.log(success,"Add To Cart Successful");
                        res.json({
                            status: 200,
                            message:'Added To Cart Successfully',
                        });
                    }
                }
            );
        }

        else{
            CartModel.updateOne(
                { email: req.body.email },
                { $push: {books: book} },
                (error, success) => {
                    if (error) {
                    console.log(error,"Add To Cart Error");
                    res.json({
                        status: 400,
                        message:'Error while adding in Cart',
                        });
                    } else {
                    console.log(success,"Add To Cart Successful");
                    res.json({
                        status: 200,
                        message:'Added To Cart Successfully',
                        });
                    }
                }
            );
        }
    })
};

exports.removeFromCart = (req,res)=>{
    
    console.log("req body in remove cart",req.body)

    CartModel.updateOne(
        { email: req.body.email },
        { $pull: {books:req.body.id } },
        (error, success) => {
          if (error) {
            console.log(error,"Error in Removing From Cart");
            res.json({
                status: 400,
                message:'Error in Removing From Cart',
             });
          } 
          else {
            console.log(success,"Removed From Cart Successfully");
            res.json({
                status: 200,
                message:'Removed From Cart Successfully',
             });
          }
        }
      );
    }


exports.getCart = (req,res)=>{
    CartModel.find({email: req.params.email}).then(data => {
        console.log("GET CART DATA:",data);
        res.json(data);
    })
}

exports.getOrderDetails = (req,res)=>{
    OrderModel.find({email: req.params.email}).then(data => {
        console.log("GET ORDER DATA:",data);
        if(data){
            res.json({
                status:200,
                data: data
            });
        }
        else{
            res.json({
                status:200,
                data: data
            });
        }
       
    })
}

exports.placeOrder = async (req,res)=>{
    let wallet;
    const totalAmount = req.body.totalAmount;
    async.waterfall([
        function fun1(cb){
            UserModel.find({email: req.body.email}, function (error,data){
                console.log(data)
                wallet = data[0].wallet
                console.log(wallet)
                if(totalAmount<=wallet)
                {
                    const booksData =req.body.books
                    // booksData.forEach(async value => {
                    //     console.log(value)
                    //     await OrderModel.updateOne(
                    //         { email: req.body.email },
                    //         { $push: {books: value} },
                    //         (error, success) => {
                    //             if (error) {
                    //             console.log(error,"update order errrr");        
                    //             } else {
                    //             console.log(success,"order updated");           
                    //             }
                    //         }
                    //     ).clone();
                    // });


                    OrderModel.updateOne(
                        { email: req.body.email },
                        { $push: {books: req.body.books} },
                        (error, success) => {
                            if (error) {
                            console.log(error,"update order errrr");
                            return cb(new Error('errrrrorrr'));
                            } 

                            else {
                            console.log(success,"order updated");
                            return cb(null);                                                       
                            }
                        }
                    )
                    
                }
                
            
            })
        },

        function fun2(cb){
            CartModel.updateOne(
                { email: req.body.email },
                { $pull: {books: {quantity: {$gte: 0}}} },
                (error, success)=>{
                    if (error) {
                        console.log(error,"Error on deleting");
                        return cb(error);
                    } 
                    else {
                        console.log(success,"delete from cart successful");
                        const amounttLeft=wallet-totalAmount;
                        return cb(null,amounttLeft);
                    }
                }
            ); 
            
        },

        function fun3(amounttLeft,cb){
            UserModel.updateOne(
                { email: req.body.email },
                { wallet: amounttLeft},
                (error, success)=> {
                    if (error) {
                        console.log(error,"Wallet Not Updated");
                        return cb(error);
                    } else {
                        console.log(success,"Wallet Updated Successful");
                        return cb(null);
                    }
                }
            );
        }

    ],

    function (error){
        if(error){
            let data=totalAmount-wallet;
            console.log("else section of place order");
            res.json({
                status: 404,
                message:'Order Not Placed ',
                data: data
             });
        }

        else{
            console.log("result");
            res.json({
                status: 200,
                message:'Order Placed Successfully',
             });
        }
    })

}

    

//     if(totalAmount<=wallet)
//     {
//         console.log("wallet2:",wallet,typeof(wallet))
//         console.log("totalAmount2:",totalAmount,typeof(totalAmount))
//         const booksData =req.body.books
//         booksData.forEach(value => {
//             console.log(value)
//             OrderModel.updateOne(
//                 { email: req.body.email },
//                 { $push: {books: value} },
//                 (error, success) => {
//                     if (error) {
//                     console.log(error,"update order errrr");
//                     } else {
//                     console.log(success,"order updated");
//                     }
//                 }
//                 );
//         });

//         CartModel.updateOne(
//             { email: req.body.email },
//             { $pull: {books: {quantity: {$gte: 0}}} },
//             (error, success)=>{
//             if (error) {
//                 console.log(error,"Error on deleting");
//             } else {
//                 console.log(success,"delete from cart successful");
//             }
//             }
//         ); 

//         const amounttLeft=wallet-totalAmount
//         console.log(amounttLeft, typeof(amounttLeft))
//         UserModel.updateOne(
//             { email: req.body.email },
//             { wallet: amounttLeft},
//             (error, success)=> {
//                 if (error) {
//                     console.log(error,"Wallet Not Updated");
//                 } else {
//                     console.log(success,"Wallet Updated Successful");
//                 }
//             }
//         );

//         res.json({
//             status: 200,
//             message:'Order Placed Successfully',
//          });
//     }

//     else
//     {

//         data=totalAmount-wallet
//         console.log("else section of place order")
//         res.json({
//             status: 404,
//             message:'Order Not Placed ',
//             data: data
//          });
//     }
   
// }

