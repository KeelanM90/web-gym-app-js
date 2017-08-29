'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');

const assessmentStore = {

  store: new JsonStore('./models/assessment-store.json', { membersAssessments: [] }),
  collection: 'membersAssessments',

  getAssessments(memberId) {
    const assessments = this.store.findOneBy(this.collection, { memberId: memberId }).assessments;
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

  getAssessmentsTrends(member, idealWeight) {
    let assessments = this.getAssessments(member.id);
    for (let i = 0; i < assessments.length; i++) {
      let lastWeight = member.weight;
      if (i < assessments.length - 1) {
        lastWeight = assessments[i + 1].weight;
      };

      let deltaCurrent = assessments[i].weight - idealWeight;
      let deltaPrevious = lastWeight - idealWeight;

      if (deltaCurrent < 0) {
        deltaCurrent = -deltaCurrent;
      }

      if (deltaPrevious < 0) {
        deltaPrevious = -deltaPrevious;
      }

      if (deltaPrevious < deltaCurrent) {
        assessments[i].trend = 'red';
      } else if (deltaPrevious > deltaCurrent) {
        assessments[i].trend = 'green';
      } else {
        assessments[i].trend = 'blue';
      }
    };

    return assessments;
  },

  createEmptyArray(memberId) {
    const data = {
      memberId: memberId,
      assessments: [],
    };
    this.store.findAll(this.collection).push(data);
    this.store.save();
  },

  addAssessment(memberId, assessment) {
    const assessments = this.getAssessments(memberId);
    assessments.push(assessment);
    this.store.save();
  },

  removeAssessment(memberId, assessmentId) {
    const assessments = this.getAssessments(memberId);
    _.remove(assessments, { assessmentId: assessmentId });
    this.store.save();
  },

  deleteMembersAssessments(memberId) {
    _.remove(this.store.findAll(this.collection), { memberId: memberId });
    this.store.save();
  },
};

module.exports = assessmentStore;
