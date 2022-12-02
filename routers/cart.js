var express = require('express')
const checkAuth = require('../utilities/check-auth')
// const router = express.Router()

var cart = require('../controllers/cart');

let app = express();

module.exports = function(app){
    
    app.post('/cart/add',cart.addToCart);
    app.post('/cart/remove',cart.removeFromCart);
    app.get('/cart/:email', cart.getCart);
    app.post('/order',cart.placeOrder);
    app.get('/order/:email', cart.getOrderDetails);




    
}