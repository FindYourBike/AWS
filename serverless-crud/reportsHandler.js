'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tablereports = "FindYourBikeDailyReports";

module.exports = (event, callback) => {
  const body = JSON.parse(event.body);

  switch (event.httpMethod.toUpperCase()) {
    case "GET":
      var bike = event.pathParameters.id;
      console.log("bikeid: " + bike)
      var responseBody = {}
      var params = {
        TableName : tablereports,
        ExpressionAttributeNames: { "#t": "time" },
        ProjectionExpression:"BikeID, #t, distance, nodes",
        KeyConditionExpression: "BikeID = :id",
        ExpressionAttributeValues: {
          ":id": bike,
        },
        ScanIndexForward: false
      };
      console.log("params: " + params)
      dynamoDb.query(params, function(err, data) {
        if (err) {
          console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
          console.log("Query succeeded.");
          console.log(data);
          console.log("FIRST: " + data.Items[0]);
          responseBody.id = data.Items[0].BikeID;
          responseBody.time = data.Items[0].time;
          responseBody.distance = data.Items[0].distance;
          responseBody.nodes = data.Items[0].nodes;
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
      callback("unsupported HTTP method for reports")
  }
}
