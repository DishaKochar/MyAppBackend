var express = require('express')
const checkAuth = require('../utilities/check-auth')
// const router = express.Router()

var book  = require('../controllers/book');

let app = express();

module.exports = function(app){
    
    app.post('/book/add',checkAuth, book.addBook);
    app.get('/books', book.getBooks);
    
}