'use strict';

var SingleEntity = require('../model/SingleEntity');
var zmq = require('zeromq');

var entities = new Map();
var Supervisor;



class MetaManager{

    /**
     * Method to create an entity. First creates it just with an ID (which initializes Robot, Devices, DeviceListener...).
     * Then sets up device listeners according to functions to analyze data. Then, passes options for robot and devices
     * to set themselves up. Finally associates the newly created entity to the map of entities.
     * @param options
     * @returns {SingleEntity}
     */
    static addEntity(options){
        var ent = new SingleEntity();
        ent.setUpDeviceListeners(
            (msg) => {MetaManager.updateFromBluetooth(msg);},
            (msg) => {MetaManager.retrieveOrder(msg)});

        if(options.robot){
            ent.setUpRobot(options.robot);
        }
        if(options.device){
            ent.setUpDevice(options.device);
        }
        
        entities.set(ent.id, ent);

        console.log(entities);

        return ent;
    }

    /**
     * To remove an entity with a certain ID
     * @param id
     * @returns {boolean}
     */
    static removeEntity(id){
        var entity = entities.get(id);
        entity.disableDevice();
        entities.delete(id);
        return entity;
    }

    /**
     * Getter
     * @param id
     * @returns {V}
     */
    static getEntity(id){
        return entities.get(id);
    }

    /**
     * Getter of entities
     * @returns {Array}
     */
    static getEntities(){
        var array = [];
        for(let ent of entities.keys()){
            array.push(entities.get(ent));
        }

        return array;
    }

    /**
     * Main function to analyze a message from bluetooth. Bluetooth messages are essentially robot's responses to orders
     * so it is only updating in-app values of the robot.
     * @param message
     */
    static updateFromBluetooth(message){
        entities.get(message.entity).updateRobotValuesFromBluetooth(message);
    }

    /**
     * Main function to analyze a message from OSC. If a supervisor is active, sends message to it.
     * Else, by default sends message to the entity.
     * @param message
     */
    static retrieveOrder(message){
        if(Supervisor){
            Supervisor.onEntityOrder(message);
        }else{
            entities.get(message.entity).executeCommand({ command: message.cmd, value: message.arg}, true);
        }
    }

    /**
     * Intermediate function to ask to the robot its informations (works with metabots, maybe not with others)
     * @param id
     * @returns {*}
     */
    static getRobotInformationsFromDevice(id){
        return entities.get(id).askRobotInformations();
    }

    /**
     * Set a supervisor as active
     * @param supervisor
     */
    static setSupervisor(supervisor){
        Supervisor = supervisor;
    }

    /**
     * Function used at each world.step of the scene. It permits the supervisor to analyze the scene.
     */
    static stepSupervisor() {
        if(Supervisor){
            Supervisor.step();
        }
    }

    /**
     * Function called when need to
     */
    static updateEntitiesVelocities(){
        for(let key of entities.keys()){
            entities.get(key).adjustVelocity();
        }
    }



    static updateEntitiesPositionFromJSON(data)
    {
        console.log("COUCOU");
        var robots = new Map();
        MetaManager.getEntities().forEach(function(e){
            robots.set(e.id, e.robot);
        });

        var dataString = data.toString();
        var positions = JSON.parse(dataString.substr(0,dataString.indexOf('\0')));
        var r;
        for(var i = 0; i < positions.nbMetabots; i++)
        {
            var r = positions.metabots[i];
            robots.get(r.id).position.x = r.position.x;
            robots.get(r.id).position.y = 14;
            robots.get(r.id).position.z = r.position.y;
        }
    }
}
document.addEventListener('contact_update', MetaManager.updateEntitiesVelocities);

module.exports = MetaManager;

var subscriber = zmq.socket('sub');
subscriber.on('message', function(data) {
  MetaManager.updateEntitiesPositionFromJSON(data);
});
subscriber.connect("tcp://localhost:5556");
subscriber.subscribe('');
console.log("CONNECTED");