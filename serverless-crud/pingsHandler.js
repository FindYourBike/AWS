'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tablepings = "FindYourBikePings";

module.exports = (event, callback) => {
  const body = JSON.parse(event.body);

  switch (event.httpMethod.toUpperCase()) {
    case "POST":
      var bike = event.pathParameters.id;
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

      var params = {
        TableName: tablepings,
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
    case "GET":
      var bike = event.pathParameters.id;
      var responseBody = {}
      var params = {
        TableName : tablepings,
        ExpressionAttributeNames: { "#t": "time" },
        ProjectionExpression:"BikeID, #t, latitude, longitude, battery",
        KeyConditionExpression: "BikeID = :id",
        ExpressionAttributeValues: {
          ":id": bike,
        },
        ScanIndexForward: false
      };
      dynamoDb.query(params, function(err, data) {
        if (err) {
          console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
          console.log("Query succeeded.");
          console.log(data);
          console.log("FIRST: " + data.Items[0]);
          responseBody.id = data.Items[0].BikeID;
          responseBody.lat = data.Items[0].latitude;
          responseBody.lon = data.Items[0].longitude;
          responseBody.time = data.Items[0].time;
          responseBody.bat = data.Items[0].battery
          var res ={
            "statusCode": 200,
            headers: {
              "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            "body": JSON.stringify(responseBody),
            "isBase64Encoded": false
          };
          callback(null, res);
        }
      });
      break;
    default:
      callback("unsupported HTTP method for pings")
  }
}

