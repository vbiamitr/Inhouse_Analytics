var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();
var index = require('./routes/index');
var uploads = require('./routes/upload');
var clicky = require('./routes/clicky');
var ipcheck = require('./routes/ipcheck');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/', index);
app.use('/uploads', uploads);
app.use('/clicky', clicky);
app.use('/ipcheck', ipcheck);

// Error Handling Middleware

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

module.exports = app;