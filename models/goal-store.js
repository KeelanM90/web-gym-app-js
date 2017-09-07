'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');
const assessmentstore = require('../models/assessment-store');

const goalStore = {

  store: new JsonStore('./models/goal-store.json', { membersGoals: [] }),
  collection: 'membersGoals',

  getGoals(memberId) {
    const goals = this.store.findOneBy(this.collection, { memberId: memberId }).goals;
    return goals;
  },

  getSortedGoals(memberId) {
    const goals = this.getGoals(memberId);
    let sortedGoals =  _.orderBy(goals, function (value) {
          return new Date(value.date);
        }).reverse()
    ;

    const assessments = assessmentstore.getSortedAssessments(memberId);
    for (let i = 0; i < sortedGoals.length; i++) {
      let goal = sortedGoals[i];
      goal.status = 'missed';
      const goalCloseDate = new Date(goal.date);
      const goalOpenDate = new Date(goalCloseDate);
      goalOpenDate.setDate(goalOpenDate.getDate() - 3);
      goalCloseDate.setTime(goalCloseDate.getTime() + 1000 * 3600 * 24 - 1);

      for (let j = 0; j < assessments.length; j++) {
        const assessmentDate = new Date(assessments[j].date);
        if (assessmentDate <= goalCloseDate && assessmentDate >= goalOpenDate) {
          goal.status = 'assessment found';
          logger.debug(assessmentDate + ' < ' + goalCloseDate + ' - ' + assessmentDate + ' > ' + goalOpenDate);
          break;
        }
      }
    }

    return sortedGoals;
  },

  createEmptyArray(memberId) {
    const data = {
      memberId: memberId,
      goals: [],
    };
    this.store.findAll(this.collection).push(data);
    this.store.save();
  },

  addGoal(memberId, goal) {
    const goals = this.getGoals(memberId);
    goals.push(goal);
    this.store.save();
  },

  deleteMembersGoals(memberId) {
    _.remove(this.store.findAll(this.collection), { memberId: memberId });
    this.store.save();
  },
};

module.exports = goalStore;
