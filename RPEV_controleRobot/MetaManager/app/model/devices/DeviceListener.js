"use strict";

/**
 * Transitional class between Devices receiving data and messages, and the MetaManager needing to analyze
 * these messages.
 */
class DeviceListener{

    /**
     * Simple constructor, needs to know which devices it is associated to
     * @param entity
     */
    constructor(entityID){
        this.entityID = entityID;
        this.lastBluetoothMessage = "";
        this.lastOSCMessage = undefined;
    }

    /**
     * Set MetaManager's functions which will analyze datas for bluetooth and osc messages
     * @param bluetooth
     * @param osc
     */
    setMainAnalyzers(bluetooth, osc){
        this.btAnalyzer = bluetooth;
        this.oscAnalyzer = osc;
    }

    /**
     * When a bluetooth message is received, and until this message is not "$", it enters everything in a
     * string, then cuts it in different parts and sends it to the MetaManager, ready to analyze
     * @param message
     */
    bluetooth(message){
        var translated =  String.fromCharCode.apply(null, message);
        this.lastBluetoothMessage += translated;

        if(translated.indexOf('$') > -1){
            var interpreted = DeviceListener.buildBluetoothMessage(this.lastBluetoothMessage.split('$')[0]);
            this.btAnalyzer({
                entity: this.entityID,
                cmdSent: interpreted.cmdSent,
                response: interpreted.response
            });
            var lasting = this.lastBluetoothMessage.substring(this.lastBluetoothMessage.indexOf('$')+3, this.lastBluetoothMessage.length);
            while(lasting.length > 0 && lasting.indexOf('$') > -1){
                var interpreted_last = DeviceListener.buildBluetoothMessage(lasting.split('$')[0]);
                this.btAnalyzer({
                    entity: this.entityID,
                    cmdSent: interpreted_last.cmdSent,
                    response: interpreted_last.response
                });
                lasting = lasting.substring(this.lastBluetoothMessage.indexOf('$')+3, this.lastBluetoothMessage.length);
            }
            this.lastBluetoothMessage = "";
        }
    }

    /**
     * Cuts an OSC message and prepares it for the server.
     * @param message
     */
    osc(message){
        this.lastOSCMessage = message;
        this.oscAnalyzer(this.buildOSCMessage());
    }

    /**
     * Main function to cut a bluetoothMessage
     * @returns {{cmdSent: *, response: string}}
     */
    static buildBluetoothMessage(message){
        var splitted = message.split('\r\n');
        var cmdSent = splitted[0];
        var response = message.replace(cmdSent, '');
        response = response.replace(splitted[splitted.length-1], '');
        response = response.substr(response.indexOf('\r\n'), response.length);

        return {cmdSent, response};
    }

    /**
     * Cuts a bluetooth message in parts and prepares it to be analyzed. Packages.
     * @returns {{entity: *, cmd: string, arg: *}}
     */
    buildOSCMessage(){
        return {
            entity: this.entityID,
            cmd: this.lastOSCMessage.address.replace('/', ''),
            arg: this.lastOSCMessage.args[0]
        }
    }
}
module.exports = DeviceListener;