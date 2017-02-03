"use strict";

var BluetoothSerial = require('bluetooth-serial-port');
var BluetoothDevice = require('../devices/BluetoothDevice');
var JSONFile = require('jsonfile');

/**
 * Set of all devices found
 * @type {Set}
 */
var devices = new Set();

/**
 * Main Bluetooth serial port used by the static class and to discover.
 * @type {*|BluetoothSerialPort}
 */
var mainSerial = new BluetoothSerial.BluetoothSerialPort();

/**
 * Function to find a device in an array (O(n))
 * @param address
 * @returns {*}
 */
function findDevice(address){
    for(let device of devices){
        if(device.address === address || device.name === address){
            return device;
        }
    }
}

/**
 * Static class to manages devices and discovery
 */
class BluetoothManager{

    /**
     * Function to discover network and find bluetooth devices
     */
    static startDiscovery(){
        mainSerial.inquire();
        document.dispatchEvent(new Event('devicesUpdate'));
    }

    /**
     * To add a device
     * @param device
     */
    static addDevice(device){
        devices.add(device);
    }

    /**
     * To remove a device
     * @param device
     */
    static removeDevice(device){
        devices.delete(device);
    }

    /**
     * Setup function to add listener
     */
    static setupBluetooth(){
        mainSerial.on('found', function(address, name){
            var newDevice = new BluetoothDevice();
            if(!findDevice(address))
                devices.add(newDevice.setUp({address: address, name: name}));
            console.log("Device found !" + address + " " + name);
        });
    }

    /**
     * Function to ask a BluetoothDevice to connect
     * @param address
     * @returns {*}
     */
    static connectDevice(address){
        var device = findDevice(address);
        if(device){
            device.connect();
        }

        return device;
    }

    /**
     *
     * @param address
     */
    static disconnectDevice(address){
        var device = findDevice(address);
        if(device){
            device.disconnect();
        }

        return device;
    }

    /**
     * Getter of the set of devices
     * @returns {Set}
     */
    static getDevices(){
        return devices;
    };

    /**
     * Returns an array containing connected devices
     * @returns {Array}
     */
    static getConnectedDevices(){
        var connected = [];
        for(let device of devices){
            if(device.connected === true){
                connected.push(device);
            }
        }

        return connected;
    }

    /**
     * 
     * @returns {Array}
     */
    static getAvailableDevices(){
        var available = [];
        for(let device of devices){
            if(device.available === true){
                available.push(device);
            }
        }

        return available;
    }

    /**
     * To search a device when knowing its name or address
     * @param name
     * @returns {*}
     */
    static getFromNameOrAddress(name){
        return findDevice(name);
    }

    static importDevicesFrom(url){
        JSONFile.readFile(url, function(err, obj){
            if(err){
                console.log(err);
            }else{
                for(let value in obj){
                    if(obj.hasOwnProperty(value)){
                        if(obj[value].address && obj[value].name)
                            devices.add(new BluetoothDevice().setUp({address:obj[value].address, name:obj[value].name, lastconn:obj[value].lastconn}));
                    }
                }
            }
        });
    }

    static exportToJSON(url){
        var exported = {};
        var i = 0;
        for(let device of devices){
            exported[i.toString()] = { address: device.address, name: device.name, lastconn: device.last_connection.toDateString()};
            i += 1;
        }

        JSONFile.writeFile(url, exported, function(error){
            console.log(error);
        })
    }
}
module.exports = BluetoothManager;


//FOR DEBUG
devices.add(new BluetoothDevice().setUp({address:"B8:63:BC:00:46:ED", name:"ROBOTIS BT-210"}));