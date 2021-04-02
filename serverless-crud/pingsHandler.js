'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const table = "FindYourBikePings";

module.exports = (event, callback) => {
  const body = JSON.parse(event.body);

  switch (event.httpMethod.toUpperCase()) {
    case "POST":
      let bike = event.pathParameters ? event.pathParameters.id : 1;
      let now = new Date().getTime();
      let lat;
      let lon;
      let bat;

      if (event.body !== null && event.body !== undefined) {
        if (body.lat)
          lat = body.lat;
        if (body.lon)
          lon = body.lon
        if (body.bat)
          bat = body.bat
      }

      let params = {
        TableName: table,
        Item: {
          'BikeID': bike,
          'time': now,
          'latitude': lat,
          'longitude': lon,
          'battery': bat
        }
      };

      return dynamoDb.put(params, (error, data) => {
        if (error) {
          callback(error);
        }
        callback(error, params.Item);
      });
      break;
    default:
      callback("unsupported HTTP method for pings")
  }
}

