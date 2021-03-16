const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const path = require('path');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

class AppController {
  constructor() {
    this.app = express();

    this.settings();
    this.database();
    this.middleware();
    this.routes();
  }

  settings() {
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, 'views'));
  }

  database() {
    mongoose.connect(
      `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
      {
        useNewUrlParser: true,
        userCreateIndex: true,
        useUnifiedTopology: true,
      }
    );

    const db = mongoose.connection;
    db.on('error', console.log.bind(console, 'Connection error'));
    db.once('open', () => {
      console.log('Database connected');
    });
  }

  middleware() {
    // insert middleware here
  }

  routes() {
    this.app.use(router);
  }
}

module.exports = new AppController().app;
