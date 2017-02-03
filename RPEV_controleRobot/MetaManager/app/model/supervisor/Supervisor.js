"use strict";

var MetaManager = require('../MetaManager');
var Entity = require('../Entity');

/**
 * Here you register each Supervisor you implemented
 * @type {{Simple: string, Boids: string}}
 */
var SupervisorTypes = {
    Simple: "Simple",
    Boids: "Boids",
    BoidsLeader: "BoidsLeader"
};

var exports = module.exports = {};

/**
 * Main abstract class of supervisors. Each supervisor is an entity able to receive and send OSC Messages.
 */
class Supervisor extends Entity {

    constructor(name, groundSize){
        super();

        this.name = name;
        this.groundSize = {};
        this.groundSize.x = groundSize ? groundSize.x || groundSize : 1000;
        this.groundSize.y = groundSize ? groundSize.y || groundSize : 1000;
        this.groundSize.z = groundSize ? groundSize.z || groundSize : 1000;

        this.robots = this.getAllRobots();
        this.add_new_robot = true;
    }

    /**
     * Set up the supervisor, needs datas to initiate osc listener (port, address).
     * @param options
     */
    setUp(options){
        this.setUpDeviceListeners(undefined, this.onOSCMessage);
        this.setUpDevice({ osc: options });
    }

    /**
     * Gets every single robot from the metaManager, and maps it as following :
     * { entity.id (integer) => entity.robot (Robot) }
     * @returns {Map}
     */
    getAllRobots(){
        //Map of
        var robots = new Map();
        MetaManager.getEntities().forEach(function(e){
            robots.set(e.id, e.robot);
        });

        return robots;
    }

    /**
     * Adds a robot to the map of robots of the supervisor, needs an entity. (ID and robot)
     * @param entity
     */
    addRobot(entity){
        if(this.add_new_robot === true)
            this.robots.set(entity.id, entity.robot);
    }

    /**
     * Removes a robot from the list
     * @param id
     */
    removeRobot(id){
        this.robots.delete(id);
    }

    /**
     * Abstract method, called at each world's step during emulation
     */
    step(){
        //Nothing done if not overrided
    }

    /**
     * Method called when receiving an OSC message to a robot. By default, retransmits it.
     * @param message
     */
    onEntityOrder(message){
        //No analyze if not overrided
        Supervisor.retransmitMessage(message);
    }

    /**
     * Called when the supervisor receives an OSC message. Retransmits the command to each robot it has by default.
     * @param message
     */
    onOSCMessage(message){
        //Retransmits the message to every single robot
        for(let key of this.robots.keys()){
            this.sendCommand(key, message.cmd, message.arg);
        }
    }

    /**
     * Function to set robot velocity. Sends the command and sets velocity in theorical 3D world
     * @param id
     * @param options
     */
    setRobotVelocity(id, options){
        //Velocity is changed when sending a command
        /*let robot = this.robots.get(id);
        robot.velocity = options;*/

        if(options.x || options.x === 0)
            this.sendCommand(id, "dx", options.x);
        if(options.z || options.z === 0)
            this.sendCommand(id, "dy", options.z);
        //this.sendCommand(id, "dz", velocity.z);
    }

    /**
     * Function to test if a robot is out of bounds. Returns an object containing for each x, y, z a boolean.
     * @param id
     * @returns {{x: boolean, z: boolean, y: boolean}}
     */
    isOutOfBounds(id){
        let position = this.robots.get(id).position;

        return  { x: (position.x > this.groundSize.x || position.x < -this.groundSize.x),
                  z: (position.z > this.groundSize.z || position.z < -this.groundSize.z),
                  y: (position.y > this.groundSize.y || position.y < -this.groundSize.y) };
    }

    /**
     * Function to directly send a command to a robot
     * @param entity
     * @param command
     * @param arg
     */
    sendCommand(entity, command, arg){
        if(typeof entity === "number")
            MetaManager.getEntity(entity).executeCommand({command: command, value: arg}, true);
        else if(typeof entity === "object")
            entity.forEach(function(e){
                MetaManager.getEntity(e).executeCommand({command: command, value: arg}, true);
            });
    }

    /**
     * Toggle if a supervisor will automatically add to its map by default each new created robot
     */
    toggleAddByDefault(){
        this.add_new_robot = !this.add_new_robot;
    }

    /**
     * Function to test if a supervisor has a certain entity
     * @param id
     * @returns {boolean}
     */
    has(id){
        return this.robots.has(id);
    }

    /**
     * function to retransmit a capted message to its original destinator
     * @param message
     */
    static retransmitMessage(message){
        MetaManager.getEntity(message.entity).executeCommand({ command: message.cmd, value: message.arg}, true);
    }

    get size(){
        return this.groundSize;
    }

    static get types(){
        let array = [];
        for (let sup in SupervisorTypes){
            if(SupervisorTypes.hasOwnProperty(sup)){
                array.push({name : sup});
            }
        }
        return array;
    }

    /**
     * return the array of values from the map
     * @returns {Array}
     */
    get robotsArray(){
        let array = [];

        for(let key of this.robots.keys()){
            array.push(this.robots.get(key));
        }

        return array;
    }
}

exports.Supervisor = Supervisor;
exports.Types = SupervisorTypes;