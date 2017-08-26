'use strict';

const accounts = require('./accounts');
const logger = require('../utils/logger');
const dateformat = require('dateformat');
const uuid = require('uuid');
const assessmentstore = require('../models/assessment-store');
const analyticshelper = require('../utils/analyticshelper');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedinuser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Gym App Dashboard',
      user: loggedinuser,
      assessments: assessmentstore.getAssessments(loggedinuser.id),
      bmi: analyticshelper.calculateBMI(loggedinuser),
      bmiCategory: analyticshelper.getBMICategory(loggedinuser),
      idealWeightIndicator: analyticshelper.isIdealBodyWeight(loggedinuser),
    };
    response.render('dashboard', viewData);
  },

  addAssessment(request, response) {
    const userId = request.params.userid;
    const assessment = {
      assessmentid: uuid(),
      date: dateformat(new Date(), 'ddd, dd mmm yyyy HH:mm:ss Z'),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
    };
    assessmentstore.addAssessment(userId, assessment);
    response.redirect('/dashboard/');
  },

  deleteAssessment(request, response) {
    const userId = request.params.userid;
    const assessmentid = request.params.assessmentid;
    assessmentstore.removeAssessment(userId, assessmentid);
    response.redirect('/dashboard/');
  },
};

module.exports = dashboard;
