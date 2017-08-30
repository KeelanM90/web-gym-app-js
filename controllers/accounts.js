'use strict';

const userstore = require('../models/user-store');
const logger = require('../utils/logger');
const uuid = require('uuid');
const assessmentstore = require('../models/assessment-store');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('memberid', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const member = request.body;
    member.id = uuid();
    userstore.addMember(member);
    logger.info(`registering ${member.email}`);
    assessmentstore.createEmptyArray(member.id);
    response.redirect('/');
  },

  authenticate(request, response) {
    const member = userstore.getMemberByEmail(request.body.email);
    const trainer = userstore.getTrainerByEmail(request.body.email);
    if (member && member.password === request.body.password) {
      response.cookie('id', member.id);
      logger.info(`logging in ${member.email}`);
      response.redirect('/dashboard');
    } else if (trainer && trainer.password === request.body.password) {
      response.cookie('id', trainer.id);
      logger.info(`logging in ${trainer.email}`);
      response.redirect('/trainerdashboard');
    } else {
      logger.info('Incorrect password entered or user does not exist');
      response.redirect('/login');
    }
  },

  update(request, response) {
    const member = accounts.getCurrentMember(request);

    member.name = request.body.name;
    member.password = request.body.password;
    member.gender = request.body.gender;
    member.email = request.body.email;
    member.address = request.body.address;
    member.height = request.body.height;
    member.weight = request.body.weight;

    const picture = request.files.picture;

    if (picture != null) {
      userstore.addPicture(member, picture, function () {
        userstore.store.save();
        response.redirect('/dashboard');
      }
      );
    } else {
      userstore.store.save();
      response.redirect('/dashboard');
    }
  },

  getCurrentMember(request) {
    const memberId = request.cookies.id;
    return userstore.getMemberById(memberId);
  },

  getCurrentTrainer(request) {
    const trainerId = request.cookies.id;
    return userstore.getTrainerById(trainerId);
  },

  deleteMember(request, response) {
    const memberId = request.params.id;
    assessmentstore.deleteMembersAssessments(memberId);
    userstore.deleteMember(memberId);
    response.redirect('/trainerdashboard/');
  },

  getMember(memberId) {
    return userstore.getMemberById(memberId);
  },
};

module.exports = accounts;
