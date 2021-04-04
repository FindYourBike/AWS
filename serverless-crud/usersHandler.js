'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tableusers = "FindYourBikeUsers";

module.exports = (event, callback) => {

  switch (event.httpMethod.toUpperCase()) {
    case "GET":
      var params = {
        TableName: tableusers,
        Key: {
          UserID: event.pathParameters.id
        }
      };

      return dynamoDb.get(params, (error, data) => {
        if (error) {
          callback(error);
        }
        var res ={
          "statusCode": 200,
          headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
          },
          "body": JSON.stringify(data.Item),
          "isBase64Encoded": false
        };
        callback(null, res);
      });
      break;
    case "PATCH":
      const body = JSON.parse(event.body);
      console.log("body: " + event.body)
        console.log("parsed body: " + body)
      let bikes;
      if (event.body !== null && event.body !== undefined) {
        if (body.bikes)
          bikes = body.bikes
      }
      console.log(bikes)
      var params = {
        TableName: tableusers,
        Key:{
          UserID: event.pathParameters.id
        },
        UpdateExpression: "set bikes = :val",
        ExpressionAttributeValues:{
          ":val": bikes
        },
        ReturnValues:"UPDATED_NEW"
      };

      console.log("Updating the item...");
      dynamoDb.update(params, function(err, data) {
        if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
          var res ={
            "statusCode": 200,
            headers: {
              "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            "body": JSON.stringify(data),
            "isBase64Encoded": false
          };
          callback(null, res);
        }
      });
      break;
    default:
      callback("unsupported HTTP method for users")
  }
}
