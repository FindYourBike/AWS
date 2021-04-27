'use strict';

const bikesHandler = require('./bikesHandler.js');
const pingsHandler = require('./pingsHandler.js');
const usersHandler = require('./usersHandler.js');
const reportsHandler = require('./reportsHandler.js');

module.exports.bikes = (event, context, callback) => {
  bikesHandler(event, (error, result) => {
    context.succeed(result);
  });
};

module.exports.pings = (event, context, callback) => {
  pingsHandler(event, (error, result) => {
    context.succeed(result);
  });
};

module.exports.users = (event, context, callback) => {
  usersHandler(event, (error, result) => {
    context.succeed(result);
  });
};

module.exports.reports = (event, context, callback) => {
  reportsHandler(event, (error, result) => {
    context.succeed(result);
  });
};

