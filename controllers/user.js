const express = require('express')
const bodyParser = require('body-parser');
const UserModel = require('../models/UserModel');
const CartModel = require('../models/CartModel');
const OrderModel = require('../models/OrderModel');
const Mailer = require('../utilities/Mailer')
const Encryption = require('../utilities/Encryption')
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

exports.addDetails = async (req,res)=>{
   
    UserModel.findOne({email: req.body.email}).then(emailcheck => {
        console.log(req.body.verification);
        if (emailcheck){
            res.json({
            status: 404,
            message:'This email already exist',
            data:''
            })
        }

        else {
         Mailer.sender(req.body.email);
         let hashedPassword= Encryption.generateHash(req.body.password);
         console.log(hashedPassword);
         req.body.password = hashedPassword;

         UserModel(req.body).save((err,data)=>{
            
            res.json({
                status: 200,
                message:'Register Details successfully added',
                data: data
             });

        });
        
        CartModel.create(
            {
                email:req.body.email
            }
        );

        OrderModel.create(
            {
                email:req.body.email
            }
        );

        }

    });
};

exports.Verification = (req,res)=>{
    
    UserModel.findOne({email: req.params.email}).then(emailcheck => {
        if (emailcheck){
            var myquery = { email: req.params.email };
            var newvalues = { $set: {verification: true} };
            UserModel.updateOne(myquery, newvalues,(err, result) => {
                console.log("1 document updated");
                res.send("<html><body><h1>Verification Successful</h1><p>You are now a verified user</p></body></html>");
            }); 
        }

        else {
            res.send("<html><body><h1>Verification Failed</h1><p>Please use the rgistered email Id for verification</p></body></html>");
        }
    })
};

//for login
exports.loginDetails = (req,res)=>{
    UserModel.findOne({email: req.body.email}).then(checker => {
        console.log(checker);
        if (checker){
            
            if(Encryption.compareHash(req.body.password,checker.password))
            {
                const token=jwt.sign(
                    {
                    data: 'foobar'
                    },
                    'secret', 
                    { expiresIn: '1h' }
                );

                res.json({
                    status: 200,
                    message:'Valid email and password',
                    token: token
                })
            }

            else{
                res.json({
                    status: 404,
                    message:'Invalid email or password'
                });
            }
        }

        else{
            res.json({
                status: 404,
                message:'Unregistered Email'
            });
        }
        
        })
};

exports.profileDisplay= (req,res)=> {
    UserModel.findOne({email: req.params.email}).then(data => {
        console.log(req.params);

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


