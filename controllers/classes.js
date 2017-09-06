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

  viewClasses(request, response) {
    logger.info('classes rendering');
    let classes;
    const search = request.body.search;
    const difficulty = request.body.difficultysearch;
    if (search == null && difficulty == null) {
      classes = classStore.getAllClasses();
    } else {
      classes = classStore.searchClasses(search, difficulty);
    }

    logger.info(difficulty);
    const loggedinmember = accounts.getCurrentMember(request);
    const viewData = {
      title: 'Classes',
      trainersClasses: classes,
      member: loggedinmember,
    };
    response.render('viewclasses', viewData);
  },

  classSettings(request, response) {
    const classId = request.params.classid;
    const loggedintrainer = accounts.getCurrentTrainer(request);
    const thisClass = classStore.getClass(loggedintrainer.id, classId);

    const viewData = {
      title: 'Classes',
      trainer: loggedintrainer,
      thisClass: thisClass,
    };
    response.render('classsettings', viewData);
  },

  editClass(request, response) {
    const classId = request.params.classid;
    const loggedintrainer = accounts.getCurrentTrainer(request);
    const thisClass = classStore.getClass(loggedintrainer.id, classId);

    thisClass.name = request.body.name;
    thisClass.difficulty = request.body.difficulty;
    thisClass.capacity = request.body.capacity;
    thisClass.description = request.body.description;
    const picture = request.files.picture;

    if (picture != null) {
      classStore.addPicture(thisClass, picture, function () {
            classStore.store.save();
            response.redirect('/classes');
          }
      );
    } else {
      classStore.store.save();
      response.redirect('/classes');
    }
  },

  updateSession(request, response) {
    const classId = request.params.classid;
    const sessionId = request.params.sessionid;
    const loggedintrainer = accounts.getCurrentTrainer(request);
    const session = classStore.getSession(loggedintrainer.id, classId, sessionId);

    logger.debug(session);
    session.date = dateformat(request.body.sessiondate, 'ddd, dd mmm yyyy');
    session.starttime = request.body.starttime;
    session.endtime = request.body.endtime;

    classStore.store.save();
    response.redirect('/classsettings/' + classId);
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

  enrollInSession(request, response) {
    const trainerId = request.params.trainerid;
    const classId = request.params.classid;
    const sessionId = request.params.sessionid;

    const enrollment = {
      memberId: accounts.getCurrentMember(request).id,
    };

    classStore.enroll(trainerId, classId, sessionId, enrollment);
    response.redirect('/viewclasses');
  },

  unenrollFromSession(request, response) {
    const trainerId = request.params.trainerid;
    const classId = request.params.classid;
    const sessionId = request.params.sessionid;

    classStore.unenroll(trainerId, classId, sessionId, accounts.getCurrentMember(request).id);
    response.redirect('/viewclasses');
  },

  enrollAll(request, response) {
    const trainerId = request.params.trainerid;
    const classId = request.params.classid;

    classStore.enrollAll(trainerId, classId, accounts.getCurrentMember(request).id);
    response.redirect('/viewclasses');
  },

  unenrollAll(request, response) {
    const trainerId = request.params.trainerid;
    const classId = request.params.classid;

    classStore.unenrollAll(trainerId, classId, accounts.getCurrentMember(request).id);
    response.redirect('/viewclasses');
  },
};

module.exports = classes;
