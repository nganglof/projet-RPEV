"use strict";
var OSC = require('osc');
var DeviceElement = require('./DeviceElement');

/**
 * The OSCDevice inherited from the DeviceElement. It is used for the communication through OSC. Sending datas needs to
 * be tested and better handled.
 */
class OSCDevice extends DeviceElement.Device{
    constructor(){
        super();

        this.address = "127.0.0.1";

        this.dest_address = "127.0.0.1";
        this.dest_port = 9950;

        DeviceElement.PortsManager.changeDevicePort(this, 10000);
    }

    /**
     * To set up, give in options the address and the port
     * @param options
     * @returns {OSCDevice}
     */
    setUp(options){
        if(options){
            super.setUp(options);

            this.port = options.port || this.port;
            this.dest_address = options.dest_address || this.dest_address;
            this.dest_port = options.dest_port || this.dest_port;

            this.device = new OSC.UDPPort({ localAddress: this.address, localPort: this.port });


            ////////For debug//////////
            this.on('error', function(data){ console.log(data); });
            ///////////////////////////

            return this;
        }
    }

    /**
     * To set the listener (give a function).
     * @param listener
     */
    setListener(listener){
        super.setListener('message', listener);
    }

    /**
     * Connects the device. First verifies the port is free, then launches the server.
     */
    connect(){
        DeviceElement.PortsManager.addDevice(this);
        this.device.open();
        this.connected = true;
    }

    /**
     * Disconnects
     */
    disconnect(){
        this.device.close();
        this.connected = false;
    }

    send(data){
        this.device.send({address: data.address, args: data.args}, this.dest_address, this.dest_port);
    }

    /**
     * To modify, give the same options as to setUp.
     * @param options
     */
    modify(options){
        if(options){
            DeviceElement.PortsManager.removeDevice(this);
            this.disconnect();
            this.setUp(options);
            //DeviceElement.PortsManager.addDevice(this);
        }
    }

    /**
     * To refresh after stopping a server. Needs to have the listener function.
     * @param listener
     */
    refresh(listener){
        if(this.connected === true)
            this.disconnect();
        this.device = new OSC.UDPPort({ localAddress: this.address, localPort: this.port });
        this.setListener(listener);
    }
}

module.exports = OSCDevice;