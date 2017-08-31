'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
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

  addPicture(member, imageFile, response) {
    if (member.img != null) {
      const id = path.parse(member.img);
      cloudinary.api.delete_resources([id.name], function (result) {
        console.log(result);
      }
      );
    }
    imageFile.mv('tempimage', err => {
      if (!err) {
        cloudinary.uploader.upload('tempimage', result => {
          console.log(result);
          member.img = result.url;
          this.store.save();
          response();
        });
      }
    });
  },
};

module.exports = userStore;
