'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tablebikes = "FindYourBikeBikes";
const tablepings = "FindYourBikePings";

module.exports = (event, callback) => {
  const body = JSON.parse(event.body);

  switch (event.httpMethod.toUpperCase()) {
    case "GET":
      let bike = event.pathParameters.id;
      var params = {
        TableName : tablebikes,
        ProjectionExpression:"BikeID, bikename",
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
          var responseBody = data.Items[0]
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
        }
      });
      break;
    case "PATCH":
      break;
    default:
      callback("unsupported HTTP method for bikes")
  }
}
