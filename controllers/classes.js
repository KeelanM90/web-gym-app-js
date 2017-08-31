'use strict';

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

  deleteClass(request, response) {
    const trainerId = request.params.trainerid;
    const classId = request.params.classid;
    classStore.removeClass(trainerId, classId);

    response.redirect('/classes');
  },
};

module.exports = classes;
