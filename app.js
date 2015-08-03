var express = require('express');
var expressPartials = require('express-partials');
var expressSesion = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride('_method'));
app.use(cookieParser('Quiz_2015'));
app.use(expressSesion());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressPartials());

//helpers dinamicos
app.use(function(req, res, next) {
  //guarda path en session.redir para despues del login
  if (req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  //hacer req.session en las vistas
  res.locals.session = req.session;
  next();
});

//autologout
app.use(function(req, res, next) {
  var now = new Date();
  var temp = req.session.time ? new Date(req.session.time) : new Date();

  if (!req.path.match(/\/login|\/logout/)) {
    if ((now.getMinutes() - 2) > temp.getMinutes()) {
      var errors = req.session.errors || 'Sesión caducada ...';
      req.session.errors = {};
      res.render('sessions/new', {
        errors: errors
      });
    } else {
      req.session.time = new Date();
      next();
    }
  } else {
    next();
  }
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
