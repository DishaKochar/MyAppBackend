const mongo = require('mongoose');

    var userSchema = new mongo.Schema({
        name: String,
        mobilenumber: String,
        email: String,
        address: String,
        password: String,
        wallet: Number,
        verification: Boolean
    });
    

module.exports = mongo.model('user',userSchema);