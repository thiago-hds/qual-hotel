if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const { User } = require('./models');
const { authRoutes, hotelsRoutes, reviewsRoutes } = require('./routes');

const databaseHelper = require('./utils/database');
const errorHandlerMiddleware = require('./middleware/error_handler');

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
    // this.app.use(cookieParser());

    /* sanitize */
    this.app.use(mongoSanitize());

    /* session */
    // TODO put it on a config folder
    const sessionConfig = {
      name: 'session',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true, // cookies não visíveis via javascript
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    };
    this.app.use(session(sessionConfig));

    /* passport */
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    passport.use(User.createStrategy());

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    /* flash */
    this.app.use(flash());

    /* locals */
    this.app.use((req, res, next) => {
      res.locals.success = req.flash('success');
      res.locals.error = req.flash('error');
      res.locals.sessionUser = req.user;
      next();
    });

    this.app.use(helmet({ contentSecurityPolicy: false }));

    /* morgan */
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('tiny'));
    }
  }

  routes() {
    this.app.use('/', authRoutes);
    this.app.use('/hotels', hotelsRoutes);
    this.app.use('/hotels/:id/reviews', reviewsRoutes);

    this.app.all('*', (req, res, next) => {
      next(new AppError(404, 'Page not found'));
    });
  }

  errorHandlers() {
    this.app.use(errorHandlerMiddleware);
  }
}

module.exports = new AppController().app;
