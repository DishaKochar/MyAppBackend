const express = require('express');
const checkAuth = require('../utilities/check-auth');

const book  = require('../controllers/book');

const app = express();

module.exports = function(app){
    
    app.post('/book/add',checkAuth, book.addBook);
    app.get('/books', book.getBooks);
    
}