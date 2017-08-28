'use strict';

const accounts = require('./accounts');
const logger = require('../utils/logger');
const userstore = require('../models/user-store');
const assessmentstore = require('../models/assessment-store');

const trainerdashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedintrainer = accounts.getCurrentTrainer(request);
    const users = userstore.getAllUsers();
    for (let i = 0; i < users.length; i++) {
      users[i].assessmentssize = assessmentstore.getAssessments(users[i].id).length;
    };
    const viewData = {
      title: 'Gym App Trainer Dashboard',
      trainer: loggedintrainer,
      users: users,
    };
    response.render('trainerdashboard', viewData);
  },
};

module.exports = trainerdashboard;
