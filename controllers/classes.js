'use strict';

const uuid = require('uuid');
const accounts = require('./accounts');
const logger = require('../utils/logger');
const classStore = require('../models/class-store');

const classes = {
  index(request, response) {
    logger.info('classes rendering');

    const loggedintrainer = accounts.getCurrentTrainer(request);
    const classes = classStore.getTrainersClasses(loggedintrainer.id);
    const viewData = {
      title: 'Classes',
      trainer: loggedintrainer,
      classes: classes,
    };
    response.render('classes', viewData);
  },

  addClass(request, response) {
    const trainerId = request.params.trainerid;

    const newClass = {
      assessmentId: uuid(),
      name: request.body.name,
    };
    classStore.addClass(trainerId, newClass);

    response.redirect('/classes');
  },

  deleteClass(request, response) {
    const trainerId = request.params.trainerid;
    const classId = request.params.classid;
    classStore.removeClass(trainerId, classId);

    response.redirect('/classes');
  },
};

module.exports = classes;
