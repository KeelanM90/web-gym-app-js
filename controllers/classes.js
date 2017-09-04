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
        date: dateformat(date, 'yyyy-mm-dd'),
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

    const term = request.body.term;
    const days = request.body.days.toString().split(',');
    const startingDate = request.body.startingweek;

    const newClass = {
      classId: uuid(),
      name: request.body.name,
      difficulty: request.body.difficulty,
      capacity: request.body.capacity,
      description: request.body.description,
      sessions: [],
    };
    for (let i = 0; i < term; i++) {
      for (let j in days) {
        let tempDate = new Date(startingDate);
        const dateChange = (i * 7) + Number(days[j]);
        newClass.sessions.push({
              sessionId: uuid(),
              date: dateformat(tempDate.setDate(tempDate.getDate() + dateChange), 'ddd, dd mmm yyyy'),
              starttime: request.body.starttime,
              endtime: request.body.endtime,
              enrollments: [],
            }
        );
      }
    }

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
