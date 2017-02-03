"use strict";

var BluetoothSerial = require('bluetooth-serial-port');
var DeviceElement = require('./DeviceElement');

var MAX_CONNECTION_TRIES = 3;

/**
 * Device to manage communication with bluetooth. Each BluetoothDevice is an independant entity, which can be
 * after being created, associated to a real device.
 */
class BluetoothDevice extends DeviceElement.Device{
    constructor(){
        super();

        this.channel = 0;
        this.available = true;
        this.connecting = false;
        this.tries = 0;
        this.tries_connect = 0;
        this.last_connection = undefined;
    }

    /**
     * To set up, only needs an address and optionally a name.
     * @param options
     * @returns {BluetoothDevice}
     */
    setUp(options){
        if(options){
            super.setUp(options);

            this.device = new BluetoothSerial.BluetoothSerialPort();
            this.on('closed', function(){
                console.log('connection closed');
                this.connected = false;
                this.connecting = false;
                document.dispatchEvent(new Event('devicesUpdate'));
            });

            ///////For debug//////////
            this.on('data', function(data){ console.log("Log : " + data.toString('utf-8')); });
            this.on('finished', function(){ console.log("Scan did finish"); });
            //////////////////////////

            return this;
        }
    }

    /**
     * Specific listener for bluetooth
     * @param listener
     */
    setListener(listener){
        super.setListener('data', listener);
    }

    /**
     * Tries to connect to the real bluetooth device. First it tries to find a channel to connect.
     * If it succeeds, tries to finalize the connection.
     */
    connect(){
        this.tries += 1;
        this.connecting = true;
        var self = this;

        this.device.findSerialPortChannel(this.address, function(channel){
            self.channel = channel;
            console.log("Channel found !" + channel);
            if(self.channel !== 0){
                self.connection_try_timeout = setInterval(function(){
                    self.finalizeConnection();
                }, 2000);
            }
        });
    }

    /**
     * Function which will try every 2 seconds for 6 seconds to connect to a bluetooth device.
     */
    finalizeConnection(){
        var self = this;

        if(self.connected === false && self.tries_connect < MAX_CONNECTION_TRIES) {
            self.tries_connect += 1;

            //First we try to connect
            this.device.connect(this.address, this.channel, function () {
                console.log('connected');
                self.connected = true;
                self.connecting = false;
                self.last_connection = Date.now();
                document.dispatchEvent(new Event("devicesUpdate"));

            }, function () {
                //If it failed, if we are not already connected and if we haven't tried too many times, we retry
                if (self.tries_connect < MAX_CONNECTION_TRIES && self.connected === false) {
                    console.log('Unable to connect, retrying in 2 seconds...');
                }else{
                    console.log("Couldn't connect");
                    self.connecting = false;
                    self.tries_connect = 0;
                    clearInterval(self.connection_try_timeout);
                    document.dispatchEvent(new Event("devicesUpdate"));

                    self.device.close();
                    self.setUp({name: self.name, address:self.address, lastconn: self.last_connection});
                }

            });
        }else{
            clearInterval(self.connection_try_timeout);
        }
    }

    /**
     * Function to disconnect. Closes the device and reinits every field.
     */
    disconnect(){
        this.device.close();
        this.connected = false;
        this.connecting = false;
        this.tries = 0;
        this.tries_connect = 0;
    }

    /**
     * Send data to the device. Each message is sent in utf-8 and with an \n at the end. There is no need for
     * the data message to have the \n, it will be added at the moment when message is sent.
     * @param data
     */
    send(data){
        this.device.write(new Buffer(data + "\n", 'utf-8'), (err) => { if(err) console.log(err); });
    }

    /**
     * To modify. Needs the same options as to setUp.
     * @param options
     */
    modify(options){
        if(options) {
            this.disconnect();
            this.setUp(options);
        }
    }
}
module.exports = BluetoothDevice;