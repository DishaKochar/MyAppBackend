var express = require('express')
//var RegisterController = require('./controllers/RegisterController');
//var LoginController = require('./controllers/LoginController');
var user = require('./routers/user')
var book = require('./routers/book')
var cart = require('./routers/cart')



let bodyParser = require('body-parser');
const mongo = require('mongoose');
let cors =  require('cors');


var app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//const url = 'mongodb://localhost/MyApp'
const url = 'mongodb+srv://disha:12345@todolistcluster.y8wxqsx.mongodb.net/MyApp?retryWrites=true&w=majority'

mongo.connect(url)

mongo.connection.on('open',function(){
    console.log(' db connected')
})


// LoginController(app);
// RegisterController(app);
user(app)
book(app)
cart(app)


app.listen(3000,function(){
    console.log('server started')
})

