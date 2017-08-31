'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');


const classStore = {

  store: new JsonStore('./models/class-store.json', { trainersClasses: [] }),
  collection: 'trainersClasses',

  getTrainersClasses(trainerId) {
    const classes = this.store.findOneBy(this.collection, { trainerId: trainerId }).classes;
    return classes;
  },

  removeClass(trainerId, classId) {
    const classes = this.getTrainersClasses(trainerId);
    _.remove(classes, { classId: classId });
    this.store.save();
  },
};

module.exports = classStore;
