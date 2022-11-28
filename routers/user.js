var express = require('express')
// const router = express.Router()

var user  = require('../controllers/user');
const checkAuth = require('../utilities/check-auth')


let app = express();

module.exports = function(app){
    
    app.post('/register', user.addDetails);
    app.post('/',user.loginDetails);
    app.get('/verification/:email',user.Verification);
    app.get('/profile/:email',checkAuth,user.profileDisplay)
}