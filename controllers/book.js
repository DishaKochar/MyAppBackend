const express = require('express');
const bodyParser = require('body-parser');
const BookModel = require('../models/BookModel');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

exports.addBook = (req,res)=>{
   
    BookModel.findOne({name: req.body.name}).then(check => {
        if (check){
         res.json({
            status: 404,
            message:'This book already present',
         });
        }

        else {
          BookModel(req.body).save((err,data)=>{
            res.json({
                status: 200,
                message:'Book Details successfully added',
                data: data
             });
          });
        }
    });
};

exports.getBooks = (req,res)=>{
    BookModel.find({}).then(data => {
        res.json(data);
    });
};



