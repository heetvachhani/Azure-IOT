'use strict';

var EventHubClient = require('azure-event-hubs').Client;

var config = require('config');
if (config.has('optionalFeature.detail')) {
  var detail = config.get('optionalFeature.detail');
  console.log('Could not get configs ' + detail)
}
 
var connectionString = config.get('Azure.iotHub.connectionString');

var printError = function (err) {
  console.log(err.message);
};

var printMessage = function (message) {
  console.log('Message received: ');
  console.log(JSON.stringify(message.body));
  console.log('');
};

var client = EventHubClient.fromConnectionString(connectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', printError);
                receiver.on('message', printMessage);
            });
        });
    })
    .catch(printError);