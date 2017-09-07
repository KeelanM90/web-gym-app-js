'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');

const assessmentStore = {

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

module.exports = assessmentStore;
