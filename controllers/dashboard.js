'use strict';

const accounts = require('./accounts');
const logger = require('../utils/logger');
const dateformat = require('dateformat');
const uuid = require('uuid');
const userstore = require('../models/user-store');
const assessmentstore = require('../models/assessment-store');
const goalstore = require('../models/goal-store');
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
      goals: goalstore.getSortedGoals(loggedInMember.id),
      bmi: analyticshelper.calculateBMI(loggedInMember),
      bmiCategory: analyticshelper.getBMICategory(loggedInMember),
      idealWeightIndicator: analyticshelper.isIdealBodyWeight(loggedInMember),
      bookings: assessmentstore.getMembersBookings(loggedInMember.id),
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
    response.redirect('/dashboard');
  },

  goals(request, response) {
    logger.info('Goals rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const viewData = {
      title: 'Members Goals',
      member: loggedInMember,
      goals: goalstore.getSortedGoals(loggedInMember.id),
    };
    response.render('goals', viewData);
  },

  deleteAssessment(request, response) {
    const memberId = request.params.memberid;
    const assessmentId = request.params.assessmentid;
    assessmentstore.removeAssessment(memberId, assessmentId);
    response.redirect('/dashboard');
  },

  addGoal(request, response) {
    const memberId = accounts.getCurrentMember(request).id;
    const goal = {
      goalId: uuid(),
      date: dateformat(request.body.sessiondate, 'ddd, dd mmm yyyy'),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
      tolerance: request.body.tolerance,
      description: request.body.description,
    };
    goalstore.addGoal(memberId, goal);
    response.redirect('/goals');
  },

  createBooking(request, response) {
    const member = accounts.getCurrentMember(request);
    const booking = {
      bookingId: uuid(),
      memberId: member.id,
      trainerId: request.body.trainer,
      date: dateformat(request.body.sessiondate, 'dd mmm yyyy'),
      time: request.body.starttime,
    };
    assessmentstore.addBooking(booking);
    response.redirect('/dashboard');
  },

  editBooking(request, response) {
    const bookingId = request.params.bookingid;
    const date = dateformat(request.body.sessiondate, 'dd mmm yyyy');
    const time = request.body.starttime;
    assessmentstore.updateBooking(bookingId, date, time);
    response.redirect('/dashboard');
  },

  cancelBooking(request, response) {
    const bookingId = request.params.bookingid;
    assessmentstore.removeBooking(bookingId);
    response.redirect('/dashboard');
  },
};

module.exports = dashboard;
