'use strict';

const _ = require('lodash');
const logger = require('../utils/logger');

const handlebars = require('handlebars');

handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

handlebars.registerHelper('selectionEquals', function (str1, str2) {
  if (str1 === str2) {
    return 'selected';
  }
});

handlebars.registerHelper('getLabel', function (string, trainer) {
  if (string === 'achieved') {
    return new handlebars.SafeString('<div class="ui fluid green label"> Achieved </div>');
  } else if (string === 'missed') {
    return new handlebars.SafeString('<div class="ui fluid red label"> Missed </div>');
  } else if (string === 'pending') {
    return new handlebars.SafeString('<div class="ui fluid yellow label"> Pending </div>');
  } else if (string === 'ongoing') {
    let url = '';
    if (trainer) {
      url = 'trainerdashboard';
    } else {
      url = 'dashboard';
    }

    const result = '<a href="/' + url + '" class="ui fluid blue label"><i class="ui plus icon"></i> Ongoing </a>';

    return new handlebars.SafeString(result);
  }
});

handlebars.registerHelper('getSessionButton', function (trainerId, parentClass, session, memberId) {
  const enrollments = session.enrollments;
  if (_.find(session.enrollments, { memberId: memberId }) != null) {
    return new handlebars.SafeString('<a href="unenroll/' + trainerId + '/' + parentClass.classId + '/' + session.sessionId +
        '" class="ui fluid red icon mini button"> <i class="ui minus icon"></i> Unenroll </a>');
  } else if (parentClass.capacity <= enrollments.length) {
    return new handlebars.SafeString('<a class="ui fluid disabled red icon mini button"> <i class="ui delete icon"></i> Full </a>');
  } else {
    return new handlebars.SafeString('<a href="enroll/' + trainerId + '/' + parentClass.classId + '/' + session.sessionId +
        '" class="ui fluid blue icon mini button"> <i class="ui plus icon"></i> Enroll </a>');
  }
});

handlebars.registerHelper('getMemberName', function (members, memberId) {
  for (let i = 0; i < members.length; i++) {
    if (members[i].id == memberId) {
      return members[i].name;
    }
  }
});

handlebars.registerHelper('getTrainerName', function (trainers, trainerId) {
  for (let i = 0; i < trainers.length; i++) {
    if (trainers[i].id == trainerId) {
      return trainers[i].name;
    }
  }
});

handlebars.registerHelper('getClassButton', function (trainerId, thisClass, memberId) {
  const sessions = thisClass.sessions;
  let full = true;
  let enrolledInOne = false;
  let canEnrollInAny =  false;
  for (let i = 0; i < sessions.length; i++) {
    let enrollments = sessions[i].enrollments;
    if (_.find(enrollments, { memberId: memberId }) != null) {
      enrolledInOne = true;
    }

    if (enrollments.length < thisClass.capacity) {
      full = false;
    }

    if ((enrollments.length < thisClass.capacity) && (_.find(enrollments, { memberId: memberId }) == null)) {
      canEnrollInAny = true;
    }
  }

  if (full) {
    if (enrolledInOne) {
      return new handlebars.SafeString('<a href="unenrollall/' + trainerId + '/' +
          thisClass.classId + '" class="ui fluid red icon tiny button"> Unenroll All </a>');
    } else {
      return new handlebars.SafeString('<a " class="ui fluid disabled red icon tiny button"> Full </a>');
    }
  } else {
    if (canEnrollInAny) {
      return new handlebars.SafeString('<a href="enrollall/' + trainerId + '/' +
          thisClass.classId + '" class="ui fluid blue icon tiny button"> Enroll All </a>');
    } else {
      return new handlebars.SafeString('<a href="unenrollall/' + trainerId + '/' +
          thisClass.classId + '" class="ui fluid red icon tiny button"> Unenroll All </a>');
    }
  }
});

handlebars.registerHelper('subtract', function (firstNumber, secondNumber) {
  return firstNumber - secondNumber;
});

module.exports = handlebars;
