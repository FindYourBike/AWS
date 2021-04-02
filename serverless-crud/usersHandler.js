'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tableusers = "FindYourBikeUsers";

module.exports = (event, callback) => {

  switch (event.httpMethod.toUpperCase()) {
    case "GET":
      const params = {
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
      break;
    default:
      callback("unsupported HTTP method for bikes")
  }
}
