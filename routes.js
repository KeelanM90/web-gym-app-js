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

router.post('/classes/:trainerid/addclass', classes.addClass);
router.get('/classes/:trainerid/deleteclass/:classid', classes.deleteClass);
router.get('/classes', classes.index);
router.get('/viewclasses', classes.viewClasses);
router.post('/viewclasses', classes.viewClasses);
router.post('/editclass/:classid', classes.editClass);
router.get('/classsettings/:classid', classes.classSettings);
router.post('/updatesession/:classid/:sessionid', classes.updateSession);

router.get('/enroll/:trainerid/:classid/:sessionid', classes.enrollInSession);
router.get('/unenroll/:trainerid/:classid/:sessionid', classes.unenrollFromSession);
router.get('/enrollall/:trainerid/:classid', classes.enrollAll);
router.get('/unenrollall/:trainerid/:classid', classes.unenrollAll);

router.post('/createbooking', dashboard.createBooking);
router.post('/trainercreatebooking', trainerdashboard.createBooking);
router.post('/editbooking/:bookingid', dashboard.editBooking);
router.post('/trainereditbooking/:bookingid', trainerdashboard.editBooking);
router.post('/performassessment/:bookingid', trainerdashboard.performAssessment);
router.get('/booking/:bookingid', trainerdashboard.booking);
router.get('/cancelbooking/:bookingid', dashboard.cancelBooking);
router.get('/trainercancelbooking/:bookingid', trainerdashboard.cancelBooking);

router.get('/trainerdashboard', trainerdashboard.index);
router.get('/about', about.index);
router.get('/profile', profile.index);
router.get('/goals', dashboard.goals);
router.get('/viewmember/:id', trainerdashboard.viewMember);

router.post('/dashboard/:id/addAssessment', dashboard.addAssessment);
router.post('/updateComment/:id/:assessmentId', trainerdashboard.updateComment);
router.get('/dashboard/:memberid/deleteassessment/:assessmentid', dashboard.deleteAssessment);

router.post('/dashboard/:memberid/addgoal', dashboard.addGoal);
router.post('/trainerdashboard/:memberid/addgoal', trainerdashboard.addGoal);

module.exports = router;
