"use strict";

var Device = require('./devices/Device');

var id_key = 0;

/**
 * Entity is an abstract class containing a device. The idea is that it is the base of a communication
 * using bluetooth, xbee or osc.
 */
class Entity{

    /**
     * A simple constructor ...?
     */
    constructor(){
        this.id = id_key++;

        this.device = new Device.Device(this.id);
    }

    /**
     * To modify, give fields device, and in this one osc and/or bluetooth, xbee.
     * @param options
     */
    modify(options){
        if(options.device.osc || options.device.bluetooth){
            this.device.modify({osc: options.device.osc, bluetooth: options.device.bluetooth});
        }
    }

    /**
     * To set up a device, needs a BluetoothDevice for bluetooth, and an address and a port for OSCDevice
     * @param options
     * @returns {Device}
     */
    setUpDevice(options) {
        if (options.bluetooth) {
            this.device.setUp(Device.type.bluetooth, options.bluetooth);
        }
        if (options.osc) {
            this.device.setUp(Device.type.osc, options.osc);
            this.device.enable(Device.type.osc);
        }
        /*if (options.xbee) {
         this.device.setUpXBee(options.xbee);
         }*/

        return this.device;
    }

    /**
     * Method to switch an OSC server listening state
     */
    switchOSCState() {
        this.device.switchOSCState();
    }

    /**
     * To disable a device
     */
    disableDevice() {
        this.device.disable();
    }

    /**
     * To toggle a robot state, meaning on/off (start/stop). Needs to be confirmed by analyzing of bluetooth
     * resoponse [improvement].
     */
    toggleRobotState(){
        if(this.robot.started === false){
            this.executeCommand({command: 'start'}, false);
            this.robot.started = true;
        }else{
            this.executeCommand({command: 'stop'}, false);
            this.robot.started = false;
        }
    }

    /**
     * Method to set deviceListeners according to functions to which will be sent datas to be analyzed
     * @param bluetooth
     * @param osc
     */
    setUpDeviceListeners(bluetooth, osc){
        this.device.setUpListeners(bluetooth, osc);
    }

    /**
     * Method to send bluetooth data
     * @param data
     */
    sendBluetoothData(data){
        this.device.send(Device.type.bluetooth, data);
    }

    /**
     * Abstract method to execute a command. According to the entity, command can be sent to one or many different
     * other entities (not the class).
     * @param command
     * @param verify
     */
    executeCommand(command, verify){}
    adjustVelocity(){}

}
module.exports = Entity;