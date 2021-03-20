const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const router = require('../routes');
const path = require('path');

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});
class AppController {
  constructor() {
    this.appInstance = express();

    this.settings();
    this.database();
    this.middleware();
    this.routes();
  }

  settings() {
    this.appInstance.engine('ejs', ejsMate);
    this.appInstance.set('view engine', 'ejs');
    this.appInstance.set('views', path.join(__dirname, 'views'));
  }

  database() {
    mongoose.connect(
      `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    this.db = mongoose.connection;
    this.db.on('error', console.log.bind(console, 'Connection error'));
    this.db.once('open', () => {
      console.log('Database connected');
    });
  }

  closeDatabaseConnection() {
    this.db.close();
  }

  middleware() {
    this.appInstance.use(express.urlencoded({ extended: true }));
    this.appInstance.use(methodOverride('_method'));
  }

  routes() {
    this.appInstance.use(router);
  }
}

module.exports = new AppController();
