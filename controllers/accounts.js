'use strict';

const userstore = require('../models/user-store');
const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('userid', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid();
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect('/');
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    if (user && user.password === request.body.password) {
      response.cookie('id', user.id);
      logger.info(`logging in ${user.email}`);
      response.redirect('/dashboard');
    } else {
      logger.info('Incorrect password entered or user does not exist');
      response.redirect('/login');
    }
  },

  update(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    if (user && user.password === request.body.password) {
      response.cookie('id', user.id);
      logger.info(`logging in ${user.email}`);
      response.redirect('/dashboard');
    } else {
      logger.info('Incorrect password entered or user does not exist');
      response.redirect('/login');
    }
  },

  getCurrentUser(request) {
    const userId = request.cookies.id;
    return userstore.getUserById(userId);
  },
};

module.exports = accounts;
