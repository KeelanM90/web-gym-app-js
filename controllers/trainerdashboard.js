'use strict';

const accounts = require('./accounts');
const logger = require('../utils/logger');
const userstore = require('../models/user-store');
const assessmentstore = require('../models/assessment-store');
const analyticshelper = require('../utils/analyticshelper');

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
    response.redirect(`/viewMember/${memberId}`);
  },
};

module.exports = trainerdashboard;
