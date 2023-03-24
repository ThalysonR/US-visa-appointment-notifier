const { AWS_REGION, SNS_TOPIC_ARN } = require('./config')

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set region
AWS.config.update({region: AWS_REGION});

async function sendMessage(msg) {
// Create publish parameters
var params = {
    Message: msg, /* required */
    TopicArn: SNS_TOPIC_ARN
  };
  
  // Create promise and SNS service object
  var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
  
  // Handle promise's fulfilled/rejected states
  return publishTextPromise.then(
    function(data) {
      console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
      console.log("MessageID is " + data.MessageId);
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });
}

module.exports.sendMessage = sendMessage