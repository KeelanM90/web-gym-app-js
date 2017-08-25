'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');

const assessmentStore = {

  store: new JsonStore('./models/assessment-store.json', { usersassessments: [] }),
  collection: 'usersassessments',

  getAssessments(userid) {
    const assessments = this.store.findOneBy(this.collection, { userid: userid }).assessments;
    if (assessments.length > 0) {
      assessments.sort(function (a, b) {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            return dateB - dateA;
          }
      );
    }

    return assessments;
  },

  createEmptyArray(userid) {
    const data = {
      userid: userid,
      assessments: [],
    };
    this.store.findAll(this.collection).push(data);
    this.store.save();
  },

  addAssessment(userid, assessment) {
    const assessments = this.getAssessments(userid);
    assessments.push(assessment);
    this.store.save();
  },

  removeAssessment(userid, assessmentid) {
    const assessments = this.getAssessments(userid);
    _.remove(assessments, { assessmentid: assessmentid });
    this.store.save();
  },
};

module.exports = assessmentStore;
