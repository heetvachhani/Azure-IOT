'use strict';

var iothub = require('azure-iothub');

var config = require('config');
if (config.has('optionalFeature.detail')) {
  var detail = config.get('optionalFeature.detail');
  console.log('Could not get configs ' + detail)
}
 
var connectionString = config.get('Azure.iotHub.connectionString');

var registry = iothub.Registry.fromConnectionString(connectionString);

var device = {
  deviceId: 'mySecondNodeDevice'
}
registry.create(device, function(err, deviceInfo, res) {
  if (err) {
    registry.get(device.deviceId, printDeviceInfo);
  }
  if (deviceInfo) {
    printDeviceInfo(err, deviceInfo, res)
  }
});

function printDeviceInfo(err, deviceInfo, res) {
  if (deviceInfo) {
    console.log('Device ID: ' + deviceInfo.deviceId);
    console.log('Device key: ' + deviceInfo.authentication.symmetricKey.primaryKey);
  }
}