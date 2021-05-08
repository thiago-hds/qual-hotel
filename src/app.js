require('dotenv').config();

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

const hotelsRouter = require('../routes/hotels');
const reviewsRouter = require('../routes/reviews');
const databaseHelper = require('./helpers/database');
const errorHandlerHelper = require('./helpers/error_handler');

const AppError = require('./utils/app_error');

class AppController {
  constructor() {
    this.app = express();

    this.settings();
    this.database();
    this.middleware();
    this.routes();
    this.errorHandlers();
  }

  settings() {
    this.app.engine('ejs', ejsMate);
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, 'views'));
  }

  database() {
    databaseHelper.connect();
  }

  middleware() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(methodOverride('_method'));
    this.app.use(express.static(path.join(__dirname, '..', 'public')));

    /* session */
    // TODO put it on a config folder
    const sessionConfig = {
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    };
    this.app.use(session(sessionConfig));

    /* flash */
    this.app.use(flash());
    this.app.use((req, res, next) => {
      res.locals.success = req.flash('success');
      res.locals.error = req.flash('success');
      next();
    });

    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('tiny'));
    }
  }

  routes() {
    this.app.use('/hotels', hotelsRouter);
    this.app.use('/hotels/:id/reviews', reviewsRouter);

    this.app.all('*', (req, res, next) => {
      next(new AppError(404, 'Page not found'));
    });
  }

  errorHandlers() {
    this.app.use(errorHandlerHelper);
  }
}

module.exports = new AppController().app;
