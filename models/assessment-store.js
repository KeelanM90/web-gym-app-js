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
    let sortedAssessments = _.sortBy(assessments, 'date').reverse();

    return sortedAssessments;
  },

  getAssessmentsTrends(member, idealWeight) {
    let assessments = this.getAssessments(member.id);
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
    this.store.save();
  },

  removeAssessment(memberId, assessmentId) {
    const assessments = this.getAssessments(memberId);
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
    const sortedMembersBookings = _.orderBy(membersBookings, ['date', 'time']);
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
    const trainersBookingsOnDate = _.filter(trainersBookings, { date: booking.date });
    let trainerIsBooked = false;
    for (let i = 0; i < trainersBookingsOnDate.length; i++) {
      if (trainersBookingsOnDate[i].time === booking.time) {
        trainerIsBooked = true;
      }
    }

    if (!trainerIsBooked) {
      this.bookingStore.add(this.bookingCollection, booking);
      this.bookingStore.save();
    }
  },

  removeBooking(bookingId) {
    const bookings = this.bookingStore.findAll(this.bookingCollection);
    _.remove(bookings, { bookingId: bookingId });
  },
};

module.exports = assessmentStore;
