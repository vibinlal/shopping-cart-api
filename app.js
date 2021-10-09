const createError = require('http-errors'); // this will handle the invalid url
const express = require('express');
var path = require('path');
const logger = require('morgan'); // for loger and will show in  terminal
//const bodyparser = require('body-parser');
var fileupload = require('express-fileupload');
const db = require('./config/connection');

var usersRouter = require('./api/routes/users');
var productsRouter = require('./api/routes/products');
var ordersRouter = require('./api/routes/orders');

const app = express();

app.use(logger('dev'));
app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: false })); // body parser
//app.use(bodyparser.urlencoded({ extended: false }));
//app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());
db.connect((err) => {
    if (err)
        console.log('connection error' + err)
    else
        console.log('database connected to the port 27017')
});




// core handler
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // "http://www.myapp.com" can use instead of *, * will permit api access from all site
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    ); //these headers will will accept while sending request

    if (req.method === "OPTIONS") {
        res.header("Accept-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE"); // these method will only accept
        return res.status(200).json({});
    }
    next();
});

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).json({
        message: 'Message code ' + err.status || 500
    });

});


module.exports = app;