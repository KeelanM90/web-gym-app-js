'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const userStore = {

  store: new JsonStore('./models/user-store.json', { users: [] }),
  trainerstore: new JsonStore('./models/user-store.json', { trainers: [] }),
  collection: 'users',
  trainercollection: 'trainers',

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  addUser(user) {
    this.store.add(this.collection, user);
    this.store.save();
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getTrainerById(id) {
    return this.trainerstore.findOneBy(this.trainercollection, { id: id });
  },

  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  getTrainerByEmail(email) {
    return this.trainerstore.findOneBy(this.trainercollection, { email: email });
  },

  deleteUser(user) {
    _.remove(this.getAllUsers(), this.getUserById(user));
    this.store.save();
  },
};

module.exports = userStore;
