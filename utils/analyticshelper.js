'use strict';

const assessmentstore = require('../models/assessment-store');

const analytics = {

  /**
   * This method calculates the BMI for the member.
   *
   * @param member the member to be analyzed
   * @return the BMI value for the member. The number returned is truncated to two decimal places.
   */
  calculateBMI(member) {
    const height = member.height;
    const weight = this.getCurrentWeight(member);
    return ((weight / height) / height).toFixed(2);
  },

  /**
   * This method determines the BMI category that the member belongs to.
   *
   * The category is determined by the magnitude of the members BMI according to the following:
   *
   * BMI less than    15   (exclusive)                      is "VERY SEVERELY UNDERWEIGHT"
   * BMI between      15   (inclusive) and 16   (exclusive) is "SEVERELY UNDERWEIGHT"
   * BMI between      16   (inclusive) and 18.5 (exclusive) is "UNDERWEIGHT"
   * BMI between      18.5 (inclusive) and 25   (exclusive) is "NORMAL"
   * BMI between      25   (inclusive) and 30   (exclusive) is "OVERWEIGHT"
   * BMI between      30   (inclusive) and 35   (exclusive) is "MODERATELY OBESE"
   * BMI between      35   (inclusive) and 40   (exclusive) is "SEVERELY OBESE"
   * BMI greater than 40   (inclusive)                      is "VERY SEVERELY OBESE"
   *
   * @param member the member that requires their BMI category
   * @return the BMI category that the member belongs to.
   */
  getBMICategory(member) {
    const bmi = this.calculateBMI(member);
    if (bmi < 15) {
      return 'VERY SEVERELY UNDERWEIGHT';
    } else if (bmi >= 15 && bmi < 16) {
      return 'SEVERELY UNDERWEIGHT';
    } else if (bmi >= 16 && bmi < 18.5) {
      return 'UNDERWEIGHT';
    } else if (bmi >= 18.5 && bmi < 25) {
      return 'NORMAL';
    } else if (bmi >= 25 && bmi < 30) {
      return 'OVERWEIGHT';
    } else if (bmi >= 30 && bmi < 35) {
      return 'MODERATELY OBESE';
    } else if (bmi >= 35 && bmi < 40) {
      return 'SEVERELY OBESE';
    } else if (bmi >= 40) {
      return 'VERY SEVERELY OBESE';
    }

    return 'Error in BMI Calculation';
  },

  /**
   * Calculates the ideal body weight based on the devine formula
   *
   * @param member The member the calculation is to be performed on
   * @return The members ideal body weight
   */
  idealBodyWeight(member) {
    let genderWeight = 0;

    let heightInInches = this.convertHeightMetresToInches(member.height);
    if (heightInInches < 60) {
      heightInInches = 60;
    }

    if (member.gender === 'Male') {
      genderWeight = 50;
    } else {
      genderWeight = 45.5;
    }

    const idealBodyWeight = genderWeight + ((heightInInches - 60) * 2.3);
    return idealBodyWeight;
  },

  /**
   * This method returns a string of semantic ui classes to indicate if the member has an
   * ideal body weight based on the Devine formula.
   *
   * @param member The member that requires their ideal weight indicator
   * @return returns a string of semantic classes based on the calculated idealBodyWeight.
   */
  isIdealBodyWeight(member) {
    const weight = this.getCurrentWeight(member);

    const idealBodyWeight = this.idealBodyWeight(member);

    if (weight >= (idealBodyWeight - 2) && weight <= (idealBodyWeight + 2)) {
      return 'green';
    } else if (weight >= (idealBodyWeight - 5) && weight <= (idealBodyWeight + 5)) {
      return 'yellow';
    } else if (weight >= (idealBodyWeight - 8) && weight <= (idealBodyWeight + 8)) {
      return 'orange';
    } else {
      return 'red';
    }
  },

  /**
   * This method finds the last recorded weight for a member
   *
   * @param member the member that the current weight is required for
   * @returns the current weight of the member
   */
  getCurrentWeight(member) {
    const assessments = assessmentstore.getAssessments(member.id);
    if (assessments.length > 0) {
      return assessments[0].weight;
    } else {
      return member.weight;
    }
  },

  /**
   * This method returns the member height converted from metres to inches.
   *
   * @param height The height in metres to be converted.
   * @return member height converted from metres to inches using the formula: metres multipled by 39.37. The number returned is truncated to two decimal places.
   */
  convertHeightMetresToInches(height) {
    const heightInInches = (height * 39.37).toFixed(2);
    return heightInInches;
  },
};

module.exports = analytics;
