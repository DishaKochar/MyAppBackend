var express = require('express')
//var RegisterController = require('./controllers/RegisterController');
//var LoginController = require('./controllers/LoginController');
var user = require('./routers/user')
var book = require('./routers/book')


let bodyParser = require('body-parser');
const mongo = require('mongoose');
let cors =  require('cors');


var app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const url = 'mongodb://localhost/MyApp'
mongo.connect(url)

mongo.connection.on('open',function(){
    console.log('connected')
})


// LoginController(app);
// RegisterController(app);
user(app)
book(app)


app.listen(3000,function(){
    console.log('server started')
})

