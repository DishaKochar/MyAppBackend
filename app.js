const express = require('express')
const user = require('./routers/user')
const book = require('./routers/book')
const cart = require('./routers/cart')



const bodyParser = require('body-parser');
const mongo = require('mongoose');
const cors =  require('cors');


const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//const url = 'mongodb://localhost/MyApp'
const url = 'mongodb+srv://disha:12345@todolistcluster.y8wxqsx.mongodb.net/MyApp?retryWrites=true&w=majority'

mongo.connect(url)

mongo.connection.on('open',function(){
    console.log(' db connected');
})


user(app);
book(app);
cart(app);


app.listen(3000,function(){
    console.log('server started');
});

