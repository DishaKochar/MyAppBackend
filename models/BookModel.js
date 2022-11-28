const mongo = require('mongoose');

    var bookSchema = new mongo.Schema({
        name: String,
        author: String,
        amount: String,
        src: String,
    });
    

module.exports = mongo.model('book',bookSchema);