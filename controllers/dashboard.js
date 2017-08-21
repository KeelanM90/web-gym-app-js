'use strict';

const accounts = require ('./accounts.js');
const logger = require('../utils/logger');
const uuid = require('uuid');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Gym App Dashboard',
    };
    response.render('dashboard', viewData);
  },
};

module.exports = dashboard;
