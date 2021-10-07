const AWS = require('aws-sdk');
const credentials = new AWS.SharedIniFileCredentials({profile: 'sns-group'});
AWS.config.credentials = credentials;
const sns = new AWS.SNS({credentials: credentials, region: 'us-east-1'});

const TopicArn = 'arn:aws:sns:us-east-1:219009475788:SNS_FOR_CARS'

const subscribeRequest = sns.subscribe(TopicArn, "email", "abdulrahimcisco92@gmail.com");
snsClient.subscribe(subscribeRequest);

console.log("SubscribeRequest: " + snsClient.getCachedResponseMetadata(subscribeRequest));
console.log("To confirm the subscription, check your email.");
// Set region
//AWS.config.update({region: 'us-east-1'});



//// Create publish parameters
//var params = {
//  Message: 'Hello there from AWS', /* required */
//  TopicArn: 'arn:aws:sns:us-east-1:219009475788:SNS_FOR_CARS'
//};
//
//// Create promise and SNS service object
//var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
//
//// Handle promise's fulfilled/rejected states
//publishTextPromise.then(
//  function(data) {
//    console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
//    console.log("MessageID is " + data.MessageId);
//  }).catch(
//    function(err) {
//    console.error(err, err.stack);
//  });