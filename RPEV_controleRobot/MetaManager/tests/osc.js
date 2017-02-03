var Device = require('../app/model/devices/Device');
var MetaTests = require('./MetaTests');

var testsPorts = new MetaTests("PORTS_TEST");
var device = new Device();
var options = {
    address:'localhost',
    port: 40000
};

device.setUpOSC(options);
testsPorts.addTest(device.oscDevice.address, 'localhost');
testsPorts.addTest(device.oscDevice.port, 40000);

device.enable();

var device2 = new Device();
device2.setUpOSC(options);
device2.enable();
testsPorts.addTest(device2.oscDevice.address, 'localhost');
testsPorts.addTest(device2.oscDevice.port, 40001);

var device3 = new Device();
device3.setUpOSC({address: 'localhost', port:13579});
device3.enable();
testsPorts.addTest(device3.oscDevice.address, 'localhost');
testsPorts.addTest(device3.oscDevice.port, 13580);

testsPorts.doTests();

var testsCom = new MetaTests("COMMUNICATION_TESTS");
testsCom.addTest(device.isOSCListening(), true);