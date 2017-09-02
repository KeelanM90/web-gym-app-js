'use strict';

const uuid = require('uuid');
const accounts = require('./accounts');
const logger = require('../utils/logger');
const classStore = require('../models/class-store');
const dateformat = require('dateformat');

const classes = {
  index(request, response) {
    logger.info('classes rendering');
    const date = new Date();
    date.setDate(date.getDate() + (7 - date.getDay()) % 7 + 1);
    let weekStartingDates = [
    ];
    for (let i = 0; i < 12; i++)
    {
      weekStartingDates[i]  = {
        date: dateformat(date, 'dd/mm/yyyy'),
        readableDate: dateformat(date, 'dddd, dd/mm'),
      };
      date.setDate(date.getDate() + 7);
    }

    const loggedintrainer = accounts.getCurrentTrainer(request);
    const classes = classStore.getTrainersClasses(loggedintrainer.id);
    const viewData = {
      title: 'Classes',
      trainer: loggedintrainer,
      classes: classes,
      weeks: weekStartingDates,
    };
    response.render('classes', viewData);
  },

  addClass(request, response) {
    const trainerId = request.params.trainerid;

    const duration = request.body.duration;

    const newClass = {
      classId: uuid(),
      name: request.body.name,
      difficulty: request.body.difficulty,
      capacity: request.body.capacity,
      description: request.body.description,
    };

    classStore.addClass(trainerId, newClass);

    const picture = request.files.picture;

    if (picture != null) {
      classStore.addPicture(newClass, picture, function () {
        classStore.store.save();
        response.redirect('/classes');
      });
    } else {
      classStore.store.save();
      response.redirect('/classes');
    }
  },

  deleteClass(request, response) {
    const trainerId = request.params.trainerid;
    const classId = request.params.classid;
    classStore.removeClass(trainerId, classId);

    response.redirect('/classes');
  },
};

module.exports = classes;
