var express = require('express')
let bodyParser = require('body-parser');
var CartModel = require('../models/CartModel');
var OrderModel = require('../models/OrderModel');
var UserModel = require('../models/UserModel');


//var Mailer = require('../utilities/Mailer')

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

exports.addToCart = function(req,res){
    const book = { id: req.body._id, name: req.body.name, author: req.body.author, amount:req.body.amount, src: req.body.src, quantity: req.body.quantity };
    console.log("add to cart Body:",req.body,req.body._id)

    CartModel.findOne({email: req.body.email, "books.id": req.body._id},{
        'books.$' : 1}).then(data => {
    //CartModel.findOne({email: req.body.email, books:{"$elemMatch":{id:req.body._id}}}).then(data => {
        console.log("FIND DATA FROM CART MODEL:",data)
        if(data !=null)
        {
            let finalQuantity =  data.books[0].quantity + req.body.quantity
            console.log("Final Quantity",finalQuantity)
            
            CartModel.updateOne({'books.id': data.books[0].id}, {'$set': {
                'books.$.quantity': finalQuantity,
                }}, function (error, success) {
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

        else{
            CartModel.updateOne(
                { email: req.body.email },
                { $push: {books: book} },
                function (error, success) {
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

exports.removeFromCart = function(req,res){
    const id = { id: req.body.id};
    console.log("req body in remove cart",req.body)
    console.log(id)

    CartModel.updateOne(
        { email: req.body.email },
        { $pull: {books:id } },
        function (error, success) {
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


exports.getCart = function(req,res){
    CartModel.find({email: req.params.email}).then(data => {
        console.log("GET CART DATA:",data)
        res.json(data)
    })
}

exports.getOrderDetails = function(req,res){
    OrderModel.find({email: req.params.email}).then(data => {
        console.log("GET ORDER DATA:",data)
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

exports.placeOrder = async function(req,res){
    var wallet;
    const totalAmount = req.body.totalAmount
    await UserModel.find({email: req.body.email}).then(data => {
        console.log("wallet:",data[0].wallet,typeof(data[0].wallet))
        console.log("totalAmount:",totalAmount,typeof(totalAmount))
        wallet = data[0].wallet

    })

    if(totalAmount<=wallet)
    {
        console.log("wallet2:",wallet,typeof(wallet))
        console.log("totalAmount2:",totalAmount,typeof(totalAmount))
        const booksData =req.body.books
        booksData.forEach(value => {
            console.log(value)
            OrderModel.updateOne(
                { email: req.body.email },
                { $push: {books: value} },
                function (error, success) {
                    if (error) {
                    console.log(error,"update order errrr");
                    } else {
                    console.log(success,"order updated");
                    }
                }
                );
        });

        CartModel.updateOne(
            { email: req.body.email },
            { $pull: {books: {quantity: {$gte: 0}}} },
            function (error, success) {
            if (error) {
                console.log(error,"Error on deleting");
            } else {
                console.log(success,"delete from cart successful");
            }
            }
        ); 

        const amounttLeft=wallet-totalAmount
        console.log(amounttLeft, typeof(amounttLeft))
        UserModel.updateOne(
            { email: req.body.email },
            { wallet: amounttLeft},
            function (error, success) {
                if (error) {
                    console.log(error,"Wallet Not Updated");
                } else {
                    console.log(success,"Wallet Updated Successful");
                }
            }
        );

        res.json({
            status: 200,
            message:'Order Placed Successfully',
         });
    }

    else
    {

        data=totalAmount-wallet
        console.log("else section of place order")
        res.json({
            status: 404,
            message:'Order Not Placed ',
            data: data
         });
    }
   
}

