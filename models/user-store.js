'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const userStore = {

  store: new JsonStore('./models/user-store.json', { members: [] }),
  trainerstore: new JsonStore('./models/user-store.json', { trainers: [] }),
  collection: 'members',
  trainercollection: 'trainers',

  getAllMembers() {
    return this.store.findAll(this.collection);
  },

  addMember(member) {
    this.store.add(this.collection, member);
    this.store.save();
  },

  getMemberById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getTrainerById(id) {
    return this.trainerstore.findOneBy(this.trainercollection, { id: id });
  },

  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  getTrainerByEmail(email) {
    return this.trainerstore.findOneBy(this.trainercollection, { email: email });
  },

  deleteMember(member) {
    _.remove(this.getAllMembers(), this.getMemberById(member));
    this.store.save();
  },
};

module.exports = userStore;
