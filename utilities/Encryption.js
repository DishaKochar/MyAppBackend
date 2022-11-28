const bcrypt = require('bcrypt');

exports.generateHash = function(password){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    return hash;
}
exports.compareHash = function(password, hashed){
    return bcrypt.compareSync(password,hashed);
}

