'use strict';

const _ = require('lodash');
const logger = require('../utils/logger');

const handlebars = require('handlebars');

handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

handlebars.registerHelper('isEnrolled', function (enrollments, memberId) {
  logger.info('Enrollments: ', enrollments, ' memberId: ', memberId);
  if (_.find(enrollments, { memberId: memberId }) != null) {
    return true;
  }

  return false;
});

module.exports = handlebars;
