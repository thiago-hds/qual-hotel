require('dotenv').config();

const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');

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
