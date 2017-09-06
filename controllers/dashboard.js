'use strict';

const accounts = require('./accounts');
const logger = require('../utils/logger');
const dateformat = require('dateformat');
const uuid = require('uuid');
const userstore = require('../models/user-store');
const assessmentstore = require('../models/assessment-store');
const analyticshelper = require('../utils/analyticshelper');
const handlebars = require('../utils/handlebarshelper.js');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const viewData = {
      title: 'Gym App Dashboard',
      member: loggedInMember,
      trainers: userstore.getAllTrainers(),
      assessments: assessmentstore.getAssessmentsTrends(loggedInMember, analyticshelper.idealBodyWeight(loggedInMember)),
      bmi: analyticshelper.calculateBMI(loggedInMember),
      bmiCategory: analyticshelper.getBMICategory(loggedInMember),
      idealWeightIndicator: analyticshelper.isIdealBodyWeight(loggedInMember),
    };
    response.render('dashboard', viewData);
  },

  addAssessment(request, response) {
    const memberId = request.params.id;
    const assessment = {
      assessmentId: uuid(),
      date: dateformat(new Date(), 'ddd, dd mmm yyyy HH:MM:ss Z'),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
    };
    assessmentstore.addAssessment(memberId, assessment);
    response.redirect('/dashboard/');
  },

  createBooking(request, response) {
    const member = accounts.getCurrentMember(request);
    const booking = {
      bookingId: uuid(),
      memberId: member.id,
      trainerId: request.body.trainer,
      date: dateformat(request.body.sessiondate, 'ddd, dd mmm yyyy'),
      time: request.body.starttime,
    };
    assessmentstore.addBooking(booking);
    response.redirect('/dashboard/');
  },

  deleteAssessment(request, response) {
    const memberId = request.params.memberid;
    const assessmentId = request.params.assessmentid;
    assessmentstore.removeAssessment(memberId, assessmentId);
    response.redirect('/dashboard/');
  },
};

module.exports = dashboard;
