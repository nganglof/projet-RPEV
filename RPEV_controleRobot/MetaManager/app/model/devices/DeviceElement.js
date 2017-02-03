"use strict";

var exports = module.exports = {};

/**
 * Base class for devices (xbee, osc, bluetooth). It provides a name, and address and information on the connected
 * state. Also used to set listeners.
 */
class DeviceElement{
    constructor(){
        this.address = undefined;
        this.name = "NONAME";
        this.device = undefined;

        this.connected = false;
    }

    /**
     * Set up with address and name
     * @param options
     */
    setUp(options){
        this.address = options.address;
        this.name = options.name;
    }

    /**
     * Function to add event listeners to the device.
     * @param event
     * @param func
     */
    on(event, func){
        this.device.on(event, func);
    }

    /**
     * Function to reference one specific listener and add it to events listening
     * @param event
     * @param listener
     */
    setListener(event, listener){
        if(listener)
            this.listener = listener;
        //Maybe this.listener instead of listener ? self.listener should be better
        this.on(event, function(data){ listener(data); });
    }

    get isConnected(){
        return this.connected;
    }

    connect(){}
    disconnect(){}
    send(data){}
    modify(){}
}
exports.Device = DeviceElement;

////////////////OSC MANAGER (PORTS)///////////////////
var devices = new Map();

/**
 * Old OSCManager, used to manage internally osc devices (with ports etc...). Used to manage conflicts.
 */
class PortsManager {
    static addDevice(device) {
        if (!devices.has(device.port)) {
            devices.set(device.port, device);
        } else {
            PortsManager.addDevice(PortsManager.changeDevicePort(device, device.port));
        }
    }

    static removeDevice(device) {
        if (devices.has(device.port)) {
            devices.delete(device.port);
            return device;
        } else {
            console.log('Error : Trying to remove not existing device.')
        }
    }

    static changeDevicePort(device, port) {
        var n_port = port ? port : device.port;

        while (devices.has(n_port)) {
            n_port += 1;
        }

        device.port = n_port;
        return device;
    }

    static handleOSCError(address, port) {
        if (devices.has(port)) {
            let device = PortsManager.removeDevice(devices.get(port));
            //Set port as already taken (by another application)
            devices.set(port, 'TAKEN_PORT');
            device.connected = false;
            PortsManager.addDevice(PortsManager.changeDevicePort(device));
        }
    }

    static has(port){
        return devices.has(port);
    }
}

process.on('uncaughtException', function (error) {

    console.log("Caught error : \n" + error.stack);

    if(error.code === "EADDRINUSE"){
        PortsManager.handleOSCError(error.address, error.port);
    }
});

exports.PortsManager = PortsManager;
////////////////////////////////////////////////////