'use strict';

const handlebars = require('handlebars');

handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

module.exports = handlebars;
