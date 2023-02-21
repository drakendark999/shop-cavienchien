var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var productRouter = require('./routes/product')
var shopRouter = require('./routes/shop');
var usersRouter =require('./routes/users')
var cartRouter = require('./routes/cart')
var checkoutRouter = require('./routes/checkout')

var apiProductsRouter = require('./routes/api')


var adminHomeRouter = require('./routes/admin/home')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

const fixPublic2 = express.static(path.join(__dirname, "public"));
app.use(fixPublic2);



app.use(session({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));


app.use('/', indexRouter);
app.use('/product',productRouter,fixPublic2)
app.use('/shop',shopRouter,fixPublic2)
app.use('/admin',adminHomeRouter,fixPublic2)
app.use('/login',usersRouter,fixPublic2)
app.use('/cart',cartRouter,fixPublic2)
app.use('/checkout',checkoutRouter,fixPublic2)


// api
app.use('/api',apiProductsRouter)







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
