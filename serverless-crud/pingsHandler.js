'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tablepings = "FindYourBikePings";

module.exports = (event, callback) => {
  const body = JSON.parse(event.body);

  switch (event.httpMethod.toUpperCase()) {
    case "POST":
      var bike = body.DevEUI_uplink.DevEUI;
      console.log("deviceID: " + bike)
      var payload_hex = body.DevEUI_uplink.payload_hex;
      console.log("payload: " + payload_hex);

      var decodedpayload = hex2a(payload_hex);
      console.log("decodedpayload: " + decodedpayload);

      var splitpayload = decodedpayload.split(", ");

      let now = new Date().getTime();
      let lat = splitpayload[0];
      let lon = splitpayload[1];
      let rq = splitpayload[2];
      let bat = splitpayload[3];

      console.log("lat: " + lat);
      console.log("lon: " + lon);
      console.log("road quality: " + rq);
      console.log("battery: " + bat);

      var params = {
        TableName: tablepings,
        Item: {
          'BikeID': bike,
          'time': now,
          'latitude': lat,
          'longitude': lon,
          'battery': bat,
          'roadquality': rq
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
          responseBody.id = bike;
          if (data.Items[0] != null || data.Items[0] != undefined) {
            responseBody.id = data.Items[0].BikeID;
            responseBody.lat = data.Items[0].latitude;
            responseBody.lon = data.Items[0].longitude;
            responseBody.time = data.Items[0].time;
            responseBody.bat = data.Items[0].battery
          }
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


  function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }
}
