'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const table = "FindYourBikePings";

module.exports = (event, callback) => {
  const body = JSON.parse(event.body);

  switch (event.httpMethod.toUpperCase()) {
    case "POST":
      let bike = event.pathParameters.id;
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
        var res ={
          "statusCode": 201,
          headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
          },
          "body": JSON.stringify(params.Item),
          "isBase64Encoded": false
        };
        callback(null, res);
      });
      break;
    default:
      callback("unsupported HTTP method for pings")
  }
}

