'use strict';

const accounts = require('./accounts');
const logger = require('../utils/logger');
const uuid = require('uuid');
const assessmentstore = require('../models/assessment-store');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedinuser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Gym App Dashboard',
      user: loggedinuser,
      assessments: assessmentstore.getAssessments(loggedinuser.id),
    };
    response.render('dashboard', viewData);
  },

  deleteAssessment(request, response) {
    const userId = request.params.userid;
    const assessmentid = request.params.assessmentid;
    assessmentstore.removeAssessment(userId, assessmentid);
    response.redirect('/dashboard/');
  },
};

module.exports = dashboard;