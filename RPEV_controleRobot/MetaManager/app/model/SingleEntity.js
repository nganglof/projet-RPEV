"use strict";

var Device = require('../model/devices/Device');
var Robot = require('./robot/Robot');
var Command = require('./robot/Command');
var SceneElement = require('../model/scene/SceneElement');
var Entity = require('./Entity');

/**
 * This class is characterized by the robot. It contains a robot and permits communication through device from the robot
 * to the real robot, and through the osc inputs. It also manages commands sent to the robot (a single robot).
 */
class SingleEntity extends Entity{

    constructor() {
        super();

        this.robot = new Robot();
    }

    /**
     * To set up a robot, needs at least a name
     * @param options
     * @returns {*}
     */
    setUpRobot(options) {
        return this.robot.setUp(options);
    }

    /**
     * Function to modify an entity according to options
     * @param options
     */
    modify(options){
        super.modify(options);
        if(options.robot){
            this.robot.modify(options.robot);
        }
        if(options.color){
            this.sceneElement.setColor(options.color);
        }
    }

    /**
     * Function to execute a command. Verify option will try to see if the last command sent is exactly the same as the
     * one sent here. If so, it will ignore the command. 
     * @param command
     * @param verify
     */
    executeCommand(command, verify){
        var cmd = new Command(command.command, command.value);
        try {
            if(verify === true){
                if(this.robot.checkExecution(cmd) === false) {
                    this.device.executeCommand(cmd.execute());
                    this.robot.executeCommand(cmd);
                }
            }else{
                this.device.executeCommand(cmd.execute());
                this.robot.executeCommand(cmd);
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Function to update values from a bluetooth message
     * @param message
     */
    updateRobotValuesFromBluetooth(message){
        if(message.args === undefined && this.askingInformations === true){
            var response = SingleEntity.parseBlueResponse(message.response);
            this.robot.modifyValue(response.cmd, response.value);
            console.log('updated ' + message.cmdSent + " : " + response.value);
        }
    }

    /**
     *
     * @param response
     * @returns {{cmd: *, value: *}}
     */
    static parseBlueResponse(response){
        var changed = response.replace('\r\n', '');
        return {
            cmd: changed.split('=')[0],
            value: changed.split('=')[1]
        };
    }

    /**
     * Function to ask robot's informations
     */
    askRobotInformations(){
        this.askingInformations = true;
        var commands = ['h', 'r', 'alt', 'freq', 'dx', 'dy', 'version'];
        var self = this;

        commands.forEach(function(e){
            self.executeCommand({command: e}, false);
        });

        var finished = function(e){
            if(self.robot.hasBeenUpdated() === true){
                document.dispatchEvent(new CustomEvent("askedInfo", {'detail': self.robot._values}));
                self.askingInformations = false;
            }else{
                setTimeout(finished, 1000);
            }
        };

        setTimeout(finished, 1500);
    }

    /**
     * Modifier of values from view, and updater of values of the robot
     * @param name
     * @param value
     */
    modifyRobotBasicValue(name, value){
        this.robot.modifyValue(name, value);
        this.executeCommand({command: name, value: value});
    }


    adjustVelocity(){
        this.executeCommand({command:'dx', value:this.robot.velocity.x}, true);
        this.executeCommand({command:'dy', value:this.robot.velocity.y}, true);
    }
}


module.exports = SingleEntity;