'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');

const assessmentStore = {

  store: new JsonStore('./models/assessment-store.json', { membersAssessments: [] }),
  bookingStore: new JsonStore('./models/assessment-store.json', { assessmentBookings: [] }),
  collection: 'membersAssessments',
  bookingCollection: 'assessmentBookings',

  getAssessments(memberId) {
    const assessments = this.store.findOneBy(this.collection, { memberId: memberId }).assessments;

    return assessments;
  },

  getSortedAssessments(memberId) {
    const assessments = this.getAssessments(memberId);
    let sortedAssessments =  _.orderBy(assessments, function (value) {
          return new Date(value.date);
        }).reverse()

    ;
    return sortedAssessments;
  },

  getAssessmentsTrends(member, idealWeight) {
    let assessments = this.getSortedAssessments(member.id);
    for (let i = 0; i < assessments.length; i++) {
      let lastWeight = member.weight;
      if (i < assessments.length - 1) {
        lastWeight = assessments[i + 1].weight;
      }

      ;

      let deltaCurrent = assessments[i].weight - idealWeight;
      let deltaPrevious = lastWeight - idealWeight;

      if (deltaCurrent < 0) {
        deltaCurrent = -deltaCurrent;
      }

      if (deltaPrevious < 0) {
        deltaPrevious = -deltaPrevious;
      }

      if (deltaPrevious < deltaCurrent) {
        assessments[i].trend = 'red';
      } else if (deltaPrevious > deltaCurrent) {
        assessments[i].trend = 'green';
      } else {
        assessments[i].trend = 'blue';
      }
    }

    ;

    return assessments;
  },

  createEmptyArray(memberId) {
    const data = {
      memberId: memberId,
      assessments: [],
    };
    this.store.findAll(this.collection).push(data);
    this.store.save();
  },

  addAssessment(memberId, assessment) {
    const assessments = this.getAssessments(memberId);
    assessments.push(assessment);
    logger.debug(assessments);
    this.store.save();
  },

  removeAssessment(memberId, assessmentId) {
    const assessments = this.getAssessments(memberId);
    logger.debug('removing', assessmentId);
    _.remove(assessments, { assessmentId: assessmentId });
    this.store.save();
  },

  deleteMembersAssessments(memberId) {
    _.remove(this.store.findAll(this.collection), { memberId: memberId });
    this.store.save();
  },

  setComment(memberId, assessmentId, comment) {
    const assessments = this.getAssessments(memberId);
    const assessment = _.find(assessments, { assessmentId: assessmentId });

    assessment.comment = comment;
    this.store.save();
  },

  getMembersBookings(memberId) {
    const bookings = this.bookingStore.findAll(this.bookingCollection);
    const membersBookings = _.filter(bookings, { memberId: memberId });
    const sortedMembersBookings = _.orderBy(membersBookings, function (value) {
            return new Date(value.date + ' ' + value.time);
          })

      ;
    return sortedMembersBookings;
  },

  getTrainersBookings(trainerId) {
    const bookings = this.bookingStore.findAll(this.bookingCollection);
    const trainersBookings = _.filter(bookings, { trainerId: trainerId });
    const sortedTrainersBookings = _.orderBy(trainersBookings, function (value) {
          return new Date(value.date + ' ' + value.time);
        })

    ;
    return sortedTrainersBookings;
  },

  addBooking(booking) {
    const trainersBookings = this.getTrainersBookings(booking.trainerId);
    let trainerIsBooked = false;
    const bookingTime = new Date(booking.date + ' ' + booking.time);
    for (let i = 0; i < trainersBookings.length; i++) {
      const oldBookingStart = new Date(trainersBookings[i].date + ' ' + trainersBookings[i].time);
      if (oldBookingStart.getTime() < (bookingTime.getTime() + 3600000) && oldBookingStart.getTime() > (bookingTime.getTime() - 3600000)) {
        trainerIsBooked = true;
      }
    }

    if (!trainerIsBooked) {
      this.bookingStore.add(this.bookingCollection, booking);
      this.bookingStore.save();
    }
  },

  getBookingById(bookingId) {
    const bookings = this.bookingStore.findAll(this.bookingCollection);
    const booking = _.find(bookings, { bookingId: bookingId });
    return booking;
  },

  updateBooking(bookingId, date, time) {
    const booking = this.getBookingById(bookingId);
    const trainersBookings = this.getTrainersBookings(booking.trainerId);
    let trainerIsBooked = false;
    const bookingTime = new Date(date + ' ' + time);
    for (let i = 0; i < trainersBookings.length; i++) {
      const oldBookingStart = new Date(trainersBookings[i].date + ' ' + trainersBookings[i].time);
      if (oldBookingStart.getTime() < (bookingTime.getTime() + 3600000) && oldBookingStart.getTime() > (bookingTime.getTime() - 3600000)) {
        trainerIsBooked = true;
      }
    }

    if (!trainerIsBooked) {
      booking.date = date;
      booking.time = time;
      this.bookingStore.save();
    }
  },

  removeBooking(bookingId) {
    const bookings = this.bookingStore.findAll(this.bookingCollection);
    _.remove(bookings, { bookingId: bookingId });
    this.bookingStore.save();
  },
};

module.exports = assessmentStore;
