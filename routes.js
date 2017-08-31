'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const dashboard = require('./controllers/dashboard.js');
const trainerdashboard = require('./controllers/trainerdashboard.js');
const about = require('./controllers/about.js');
const profile = require('./controllers/profile.js');
const classes = require('./controllers/classes.js');

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);

router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);
router.post('/update', accounts.update);
router.get('/deletemember/:id', accounts.deleteMember);

router.get('/dashboard', dashboard.index);
router.get('/classes', classes.index);
router.get('/classes', classes.index);
router.get('/trainerdashboard', trainerdashboard.index);
router.get('/about', about.index);
router.get('/profile', profile.index);
router.get('/viewmember/:id', trainerdashboard.viewMember);

router.post('/dashboard/:id/addAssessment', dashboard.addAssessment);
router.post('/updateComment/:id/:assessmentId', trainerdashboard.updateComment);
router.get('/dashboard/:memberid/deleteassessment/:assessmentid', dashboard.deleteAssessment);
router.post('/classes/:trainerid/addclass', classes.addClass);
router.get('/classes/:trainerid/deleteclass/:classid', classes.deleteClass);

module.exports = router;
