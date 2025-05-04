var createError =  require('http-errors'); // Function for creating http errors
var express = require('express');
var path = require('path')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // Corss-origin resource sharing

var indexRouter = require('./routes/route')

var app = express(); // creates express server

//Specify that connections from localhost:4200 (the client app) are allowed
app.use(cors('http://localhost:4200'));
app.use(logger('dev'))
app.use(express.json()) // parse json bodies of request
app.use(express.urlencoded({ extended : false}))
app.use(cookieParser())

app.use('/', indexRouter) // use this router for paths that start with '/'

// Global middleware to catch 404 errors and send it to error handler
app.use(function(req, res, next) {
    next(createError(404))
});


// error handler
app.use(function(err, req, res, next){
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error')
});


module.exports = app;






