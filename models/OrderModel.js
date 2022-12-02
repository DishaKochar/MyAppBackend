const mongo = require('mongoose');

    var orderSchema = new mongo.Schema({
        email: { type: String, required: true },
        books: [
            {
            id: String, 
            name: String, 
            author: String, 
            amount: String, 
            src: String,
            quantity: Number
       }
    ]

    });
    

module.exports = mongo.model('order',orderSchema);