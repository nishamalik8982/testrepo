var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var walletRouter = require('./routes/wallet');
var bitcoinWalletRouter = require('./routes/bitcoin');

// Sources bitcoin
var newAddress = require('./src/bitcoin/newAddress');
var getAddressList = require('./src/bitcoin/getAddressList');
var createTransaction = require('./src/bitcoin/createTransaction');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Pages
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/wallet', walletRouter);
app.use('/wallet/bitcoin', bitcoinWalletRouter);

// Sources bitcoin
app.use('/bitcoin/newAddress', newAddress);
app.use('/bitcoin/getAddressList', getAddressList);
app.use('/bitcoin/createTransaction', createTransaction);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
