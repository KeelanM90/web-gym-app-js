'use strict';

const accounts = require ('./accounts.js');
const logger = require('../utils/logger');
const uuid = require('uuid');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const viewData = {
      title: 'Gym App Dashboard',
      user: accounts.getCurrentUser(request),
    };
    response.render('dashboard', viewData);
  },
};

module.exports = dashboard;
