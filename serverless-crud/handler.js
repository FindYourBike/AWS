'use strict';

const bikesHandler = require('./bikesHandler.js');
const pingsHandler = require('./pingsHandler.js');
//const usersHandler = require('./todos-read-one.js');
//const reportsHandler = require('./todos-update.js');
//const todosDelete = require('./todos-delete.js');

module.exports.bikes = (event, context, callback) => {
  bikesHandler(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify(result),
    };

    context.succeed(result);
  });
};

module.exports.pings = (event, context, callback) => {
  pingsHandler(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify(result),
    };

    context.succeed(result);
  });
};

