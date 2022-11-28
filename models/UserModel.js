const mongo = require('mongoose');

    var userSchema = new mongo.Schema({
        name: String,
        mobilenumber: String,
        email: String,
        address: String,
        password: String,
        //confirmpassword: String,
        verification: Boolean
    });
    
    //var User = mongo.model('user',userSchema);

module.exports = mongo.model('user',userSchema);