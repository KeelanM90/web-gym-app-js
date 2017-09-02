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

  addPicture(classes, imageFile, response) {
    if (classes.img != null) {
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
          classes.img = result.url;
          this.store.save();
          response();
        });
      }
    });
  },
};

module.exports = classStore;
