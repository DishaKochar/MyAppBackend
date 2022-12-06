const express = require('express');

const user  = require('../controllers/user');
const checkAuth = require('../utilities/check-auth');


const app = express();

module.exports = function(app){
    
    app.post('/register', user.addDetails);
    app.post('/',user.loginDetails);
    app.get('/verification/:email',user.Verification);
    app.get('/profile/:email',checkAuth,user.profileDisplay);
}