'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');
const cloudinary = require('cloudinary');
const path = require('path');

try {
  const env = require('../.data/.env.json');
  cloudinary.config(env.cloudinary);
}
catch (e) {
  logger.info('You must provide a Cloudinary credentials file - see README.md');
  process.exit(1);
}

const classStore = {

  store: new JsonStore('./models/class-store.json', { trainersClasses: [] }),
  collection: 'trainersClasses',

  getAllClasses() {
    const classes = this.store.findAll(this.collection);
    return classes;
  },

  getTrainersClasses(trainerId) {
    const classes = this.store.findOneBy(this.collection, { trainerId: trainerId }).classes;
    return classes;
  },

  addClass(trainerId, newClass) {
    const classes = this.getTrainersClasses(trainerId);
    classes.push(newClass);
    this.store.save();
  },

  removeClass(trainerId, classId) {
    const classes = this.getTrainersClasses(trainerId);
    _.remove(classes, { classId: classId });
    this.store.save();
  },

  enroll(trainerId, classId, sessionId, enrollment) {
    const trainersClasses = this.getTrainersClasses(trainerId);
    const thisClass = _.find(trainersClasses, { classId: classId });
    const session = _.find(thisClass.sessions, { sessionId: sessionId });

    if (_.find(session.enrollments, { memberId: enrollment.memberId }) == null) {
      if (thisClass.capacity > session.enrollments.length) {
        session.enrollments.push(enrollment);
        this.store.save();
      }
    }
  },

  unenroll(trainerId, classId, sessionId, memberId) {
    const trainersClasses = this.getTrainersClasses(trainerId);
    const thisClass = _.find(trainersClasses, { classId: classId });
    const session = _.find(thisClass.sessions, { sessionId: sessionId });

    _.remove(session.enrollments, { memberId: memberId });
    this.store.save();
  },

  enrollAll(trainerId, classId, memberId) {
    const trainersClasses = this.getTrainersClasses(trainerId);
    const thisClass = _.find(trainersClasses, { classId: classId });
    const allSessions = thisClass.sessions;
    const enrollment = {
      memberId: memberId,
    };
    for (let i = 0; i < allSessions.length; i++) {
      this.enroll(trainerId, classId, allSessions[i].sessionId, enrollment);
    }
  },

  unenrollAll(trainerId, classId, memberId) {
    const trainersClasses = this.getTrainersClasses(trainerId);
    const thisClass = _.find(trainersClasses, { classId: classId });
    const allSessions = thisClass.sessions;
    for (let i = 0; i < allSessions.length; i++) {
      this.unenroll(trainerId, classId, allSessions[i].sessionId, memberId);
    }
  },

  addPicture(classes, imageFile, response) {
    if (classes.img != null) {
      const id = path.parse(classes.img);
      cloudinary.api.delete_resources([id.name], function (result) {
            console.log(result);
          }
      );
    }

    imageFile.mv('tempimage', err => {
      if (!err) {
        cloudinary.uploader.upload('tempimage', result => {
          console.log(result);
          classes.img = result.url;
          this.store.save();
          response();
        });
      }
    });
  },
};

module.exports = classStore;
