var express = require('express')
let bodyParser = require('body-parser');
var BookModel = require('../models/BookModel');
//var Mailer = require('../utilities/Mailer')

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

exports.addBook = function(req,res){
   
    BookModel.findOne({name: req.body.name}).then(check => {
        if (check){
         //Give error
         res.json({
            status: 404,
            message:'This book already present',
         })
        }

        else {
         //Run this
         //Mailer.sender(req.body.email)

         BookModel(req.body).save(function(err,data){
            //if (err) throw err;
            res.json({
                status: 200,
                message:'Book Details successfully added',
                data: data
             });
        })
        }
    })
};

exports.getBooks = function(req,res){
    BookModel.find({}).then(data => {
        console.log(data)
        res.json(data)
    })

}



