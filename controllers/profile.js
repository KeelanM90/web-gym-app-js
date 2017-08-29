'use strict';

const accounts = require('./accounts.js');
const logger = require('../utils/logger');

const profile = {
  index(request, response) {
    logger.info('profile rendering');
    const viewData = {
      title: 'Profile Settings',
      member: accounts.getCurrentMember(request),
    };
    response.render('profile', viewData);
  },
};

module.exports = profile;
