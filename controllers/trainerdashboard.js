'use strict';

const accounts = require('./accounts');
const logger = require('../utils/logger');
const userstore = require('../models/user-store');
const assessmentstore = require('../models/assessment-store');
const analyticshelper = require('../utils/analyticshelper');
const dateformat = require('dateformat');
const uuid = require('uuid');

const trainerdashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedintrainer = accounts.getCurrentTrainer(request);
    const members = userstore.getAllMembers();
    for (let i = 0; i < members.length; i++) {
      members[i].assessmentssize = assessmentstore.getAssessments(members[i].id).length;
    };

    const viewData = {
      title: 'Gym App Trainer Dashboard',
      trainer: loggedintrainer,
      members: members,
      bookings: assessmentstore.getTrainersBookings(loggedintrainer.id);
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
      assessments: assessmentstore.getAssessments(memberId),
      bmi: analyticshelper.calculateBMI(member),
      bmiCategory: analyticshelper.getBMICategory(member),
      idealWeightIndicator: analyticshelper.isIdealBodyWeight(member),
    };
    response.render('viewmember', viewData);
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
      date: dateformat(request.body.sessiondate, 'ddd, dd mmm yyyy'),
      time: request.body.starttime,
    };
    assessmentstore.addBooking(booking);
    response.redirect('/trainerdashboard/');
  },
};

module.exports = trainerdashboard;
