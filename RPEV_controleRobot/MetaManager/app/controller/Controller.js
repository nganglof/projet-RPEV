'use strict';

var MetaManager = require('../model/MetaManager');
var Scene = require('../model/scene/Scene');
var Renderer = require('../view/tags/Renderer').Renderer;
var Supervisors = require('../model/supervisor/Supervisors');
var Supervisor = require('../model/supervisor/Supervisor');
var DeviceElement = require('../model/devices/DeviceElement');


var metaScene;
var animationId = -1;
var resizeNeeded = false;

var supervisors = new Map();
var activeSupervisor;

/**
 * Here controller is essentially used as way to communicate between model and view. It doesn't compute any real things,
 * but is useful to make adjustments when transmitting the information.
 */
class Controller{

    /**
     * function called when the window is resized, in order to resize the canvas and also the 3D scene.
     */
    static resizeCanvas(){
        if(Renderer.currentContainsCanvas()){
            metaScene.renderer.resize();
        }else{
            resizeNeeded = true;
        }
    }

    /**
     * Function to create the unique scene according to a given canvas present in the DOM.
     * @param canvas
     */
    static setScene(canvas){
        metaScene = new Scene(canvas);
        //Adding ground
        metaScene.addElement({
            body:{
                mass:0,
                type:"plane",
                values:{
                    width:1e6,
                    height:1e6
                },
                material: "no_special"
            },
            mesh:{
                color: "#777777",
                materialType: "phong",
                type: "plane",
                widthSeg: 1,
                heightSeg: 1,
                castShadow: true,
                receiveShadow: true
            }
        });

        /*for(let i = 0;i<10;i++){
            var created = Controller.addEntity({
                robot:{
                name: "qfd",
                width: 1,
                legs: 4,
                height: 1,
                color: "#FFFFFF"
            },
            device :{
                osc: {
                    address: "127.0.0.1",
                    port: undefined
                },
                bluetooth: {
                    none: true
                }
            }});

            created.robot.position = {x: i*10%75, y:1, z:i*10%75};

        }*/
    }

    /**
     * To animate scene
     */
    static animateScene(){
        animate();
    }

    /**
     * To pause (stop animating) scene
     */
    static pauseWorldAndAnimations(){
        if(animationId !== -1) {
            cancelAnimationFrame(animationId);
            animationId = -1;
        }
    }

    /**
     * To restart after pausing animations.
     */
    static unpauseWorldAndAnimations(){
        if(animationId === -1){
            //Restore controls, probably temporary solution
            metaScene.renderer.addTrackballControls();
            animate();
        }
    }

    /**
     * To add an entity. It will also ask each supervisor if it wants to add it.
     * @param options
     * @returns {SingleEntity}
     */
    static addEntity(options){
        var created = MetaManager.addEntity(options);
        metaScene.addElement({ element: created.robot.sceneElement });
        for(let key of supervisors.keys()){
            supervisors.get(key).addRobot(created);
        }
        return created;
    }

    /**
     * To modify an entity
     * @param options
     * @param id
     */
    static modifyEntity(options, id){
        Controller.getEntity(id).modify(options);
    }

    /**
     * To remove an entity (removes from the model and from the scene)
     * @param id
     */
    static removeEntity(id){
        var ent = MetaManager.removeEntity(id);
        if(ent.robot.sceneElement)
            metaScene.removeElement(ent.robot.sceneElement);
    }

    /**
     * Function to get an array of entities
     * @returns {Array}
     */
    static getEntities(){
        return MetaManager.getEntities();
    }

    /**
     * Function to get a special entity
     * @param id
     * @returns {V}
     */
    static getEntity(id){
        return MetaManager.getEntity(id);
    }

    /**
     * Function to toggle osc listening of an entity
     * @param id
     */
    static switchEntityOSCListening(id){
        var ent = MetaManager.getEntity(id);
        ent.switchOSCState();
    }

    /**
     * Function to launch information request to a robot
     * @param id
     * @returns {*}
     */
    static requestRobotInfo(id){
        return MetaManager.getRobotInformationsFromDevice(id);
    }

    /**
     * Function to find an entity according to its name in an array, and with a regexp.
     * @param regexp
     * @returns {Array.<*>}
     */
    static findDevicesByRegexp(regexp){
        var entities = MetaManager.getEntities();
        var found = [];
        for(let entity of entities){
            //TODO end this with mac address
            if(entity.robot.name.match(regexp))
                found.push(entity);
        }

        return found.sort();
    }

    /**
     * Nice function to create automatically views. This one is used for range inputs in the control.tag. It should be
     * used for other views.
     * @param id
     * @returns {*}
     */
    static packageRangeControlDatas(id){
        if(id > -1) {
            var robot = Controller.getEntity(id).robot;
            var data = [];
            data.push({name: 'h', type: 'range', min: -150, max: 50, init_value: robot._values.h, description: "Height"});
            data.push({name: 'r', type: 'range', min: 80, max: 150, init_value: robot._values.r, description: "Size"});
            data.push({name: 'freq', type: 'range', min: 0, max: 4, init_value: robot._values.freq, description: "Frequency of steps"});
            data.push({name: 'alt', type: 'range', min: -200, max: 150, init_value: robot._values.alt, description: "Altitude of steps"});
            data.push({name: 'dx', type: 'text', init_value: robot._values.dx, description: "Speed in x"});
            data.push({name: 'dy', type: 'text', init_value: robot._values.dy, description: "Speed in y"});

            return data;
        }

        return null;
    }


    /**
     * Same as precedent
     * @returns {Array}
     */
    static packageDefaultRangeControlDatas(){
        var data = [];
        data.push({name: 'h', type: 'range', min: -150, max: 50, description: "Height"});
        data.push({name: 'r', type: 'range', min: 80, max: 150, description: "Size"});
        data.push({name: 'freq', type: 'range', min: 0, max: 4, description: "Frequency"});
        data.push({name: 'alt', type: 'range', min: -200, max: 150, description: "Altitude"});

        return data;
    }

    /**
     * Function to add a supervisor to Supervisor's main map.
     * @param supervisorType
     * @param name
     * @param groundSize
     * @returns {V}
     */
    static addSupervisor(supervisorType, name, groundSize){
        supervisors.set(name, new Supervisors[supervisorType](name, groundSize));
        return supervisors.get(name);
    }

    /**
     * Function to remove a supervisor
     * @param name
     */
    static removeSupervisor(name){
        supervisors.delete(name);
    }

    /**
     * Function to get current activated supervisor
     * @returns {*}
     */
    static getActiveSupervisorName(){
        return activeSupervisor;
    }

    /**
     * Function to set a supervisor active
     * @param name
     */
    static setSupervisor(name){
        if(name) {
            MetaManager.setSupervisor(supervisors.get(name));
            metaScene.createLimits(supervisors.get(name).groundSize);
        }else{
            MetaManager.setSupervisor(undefined);
            metaScene.createLimits(undefined);
        }
    }

    /**
     * Function to get every possible type of supervisor implemented
     * @returns {*}
     */
    static getSupervisorsTypes(){
        return Supervisor.Supervisor.types;
    }

    /**
     * Function to get created supervisors
     * @returns {Array}
     */
    static getSupervisors(){
        let array = [];
        for(let sup of supervisors.keys()){
            array.push(supervisors.get(sup));
        }

        return array;
    }

    /**
     * Function to verify if a port for a device has already been taken
     * @param port
     * @returns {*}
     */
    static isPortAlreadyTaken(port){
        return DeviceElement.PortsManager.has(port);
    }
}

function animate(){
    animationId = requestAnimationFrame(animate);
    metaScene.play();
}

window.addEventListener('resize', Controller.resizeCanvas, false );
document.addEventListener('windowChanged', () => {
    if(resizeNeeded === true)
        Controller.resizeCanvas();
});

module.exports = Controller;