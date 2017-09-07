'use strict';

const accounts = require('./accounts');
const logger = require('../utils/logger');
const userstore = require('../models/user-store');
const assessmentstore = require('../models/assessment-store');
const goalstore = require('../models/goal-store');
const analyticshelper = require('../utils/analyticshelper');
const dateformat = require('dateformat');
const uuid = require('uuid');

const trainerdashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedintrainer = accounts.getCurrentTrainer(request);
    const members = userstore.getAllMembers();
    for (let i = 0; i < members.length; i++) {
      members[i].assessmentssize = assessmentstore.getSortedAssessments(members[i].id).length;
    }

    const viewData = {
      title: 'Gym App Trainer Dashboard',
      trainer: loggedintrainer,
      members: members,
      bookings: assessmentstore.getTrainersBookings(loggedintrainer.id),
    };
    response.render('trainerdashboard', viewData);
  },

  viewMember(request, response) {
    logger.info('Member view rendering');
    const memberId = request.params.id;
    const member = accounts.getMember(memberId);

    const viewData = {
      title: 'Gym App Trainer Dashboard',
      member: member,
      assessments: assessmentstore.getSortedAssessments(memberId),
      bmi: analyticshelper.calculateBMI(member),
      bmiCategory: analyticshelper.getBMICategory(member),
      idealWeightIndicator: analyticshelper.isIdealBodyWeight(member),
      goals: goalstore.getSortedGoals(memberId),
      trainerview: true,
    };
    response.render('viewmember', viewData);
  },

  addGoal(request, response) {
    const memberId = request.params.memberid;
    const goal = {
      goalId: uuid(),
      date: dateformat(request.body.sessiondate, 'ddd, dd mmm yyyy'),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
      description: request.body.description,
    };
    goalstore.addGoal(memberId, goal);
    response.redirect('/viewmember/' + memberId);
  },

  booking(request, response) {
    logger.info('Perform booking rendering');
    const viewData = {
      title: 'Perform Booking',
      bookingId: request.params.bookingid,
    };
    response.render('booking', viewData);
  },

  performAssessment(request, response) {
    const booking = assessmentstore.getBookingById(request.params.bookingid);
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
    logger.debug(assessment);
    assessmentstore.addAssessment(booking.memberId, assessment);
    assessmentstore.removeBooking(booking.bookingId);

    response.redirect('/viewmember/' + booking.memberId);
  },

  updateComment(request, response) {
    //logger.info(request);
    const assessmentId = request.params.assessmentId;
    const memberId = request.params.id;
    const comment = request.body.comment;

    assessmentstore.setComment(memberId, assessmentId, comment);

    logger.info('Updating comment');
    response.redirect(`/viewMember/` + memberId);
  },

  createBooking(request, response) {
    const trainer = accounts.getCurrentTrainer(request);
    const booking = {
      bookingId: uuid(),
      memberId: request.body.member,
      trainerId: trainer.id,
      date: dateformat(request.body.sessiondate, 'dd mmm yyyy'),
      time: request.body.starttime,
    };
    assessmentstore.addBooking(booking);
    response.redirect('/trainerdashboard');
  },

  editBooking(request, response) {
    const bookingId = request.params.bookingid;
    const date = dateformat(request.body.sessiondate, 'dd mmm yyyy');
    const time = request.body.starttime;
    assessmentstore.updateBooking(bookingId, date, time);
    response.redirect('/trainerdashboard');
  },

  cancelBooking(request, response) {
    const bookingId = request.params.bookingid;
    assessmentstore.removeBooking(bookingId);
    response.redirect('/trainerdashboard');
  },
};

module.exports = trainerdashboard;
