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
      classes: classes,
    };
    response.render('classes', viewData);
  },
};

module.exports = classes;
