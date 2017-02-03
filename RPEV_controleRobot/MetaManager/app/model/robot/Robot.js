"use strict";

var LimitedStack = require('../Utility').LimitedStack;
var Command = require('./Command');
var Vector = require('../Utility').Vector;
var SceneElement = require('../scene/SceneElement');

var VELOCITY_FACTOR = 10;
var cpt_debug = 0;

/**
 * Class concerning datas of the physical robot. Its name, values like height ... and is also used
 * as transitional for communication with the scene element.
 * Later it would be nice to make this class an abstract, and create 2 new classes extending this one : metabot and
 * drone.
 */
class Robot{

    constructor(){
        //Default name uh
        this.name = "Jabberwockie";
        
        this.commands = new LimitedStack(20, new Command("start"));

        this.sceneElement = new SceneElement();

        this.started = false;

    }

    /**
     * To set up a robot, it needs a name, and optionally a width, height and number of legs.
     * Also it requires a color for the scene element.
     * @param options
     * @returns {*}
     */
    setUp(options){
        if(options){

            this.name = options.name;
            this.width = options.width || 28;
            this.legs = options.legs || 0;
            this.height = options.height || 14;

            this.valuesQty = 7;

            this._values = {
                'h':0,
                'r':0,
                'dx':0,
                'dy':0,
                'alt':0,
                'freq':0
            };
            this._version = "1.1.1";

            this.setUpSceneElement(options);

            return this;
        }else{
            return undefined;
        }
    }

    /**
     * To set up the scene element of a robot. Parameters used are dependent of the robot properties, and also
     * standardized.
     * @param options
     */
    setUpSceneElement(options){
        this.sceneElement.setBody({
            mass:1,
            type: 'cube',
            values:{
                width: this.width,
                height: this.height,
                depth: this.width,
            },
            position:{
                x: (cpt_debug==1)?250:1,
                y: this.height,
                z: (cpt_debug==2)?250:1,
            }
        });
        this.sceneElement.setMesh({
            material: {
                type: "phong",
                color: options.color || 0xffffff
            },
            type: "box",
            width: this.width * 2,
            height: this.height * 2,
            depth: this.width * 2,
            widthSeg: 10,
            heightSeg: 10,
            castShadow: true,
            receiveShadow: true
        })

        cpt_debug++;
    }

    /**
     * (Needs to be updated) Way to verify if each value of the set of values has been updated.
     * @returns {boolean}
     */
    hasBeenUpdated(){
        if(this.valuesQty === 0){
            this.valuesQty = 7;
            return true;
        }else{
            return false;
        }
    }

    /**
     * To modify a single value with its name as a string
     * @param name
     * @param value
     */
    modifyValue(name, value){
        if(name === 'version')
            this._version = value;
        else
            this._values[name] = parseInt(value);
        this.valuesQty -= 1;
    }

    /**
     * To modify the robot. Takes the same parameters in options as to set up.
     * @param options
     */
    modify(options){
        this.name = options.name || this.name;
        this.width = options.width || this.width;
        this.height = options.height || this.height;
        this.legs = options.legs || this.legs;

        //TODO MODIFY MESH
        //this.position.copy(options.position);
    }

    /**
     * Add a command to the list of commands
     * @param command
     */
    addExecutedCommand(command){
        this.commands.add(command);
    }

    /**
     * Function to get executed commands
     * @returns {LimitedStack}
     */
    getExecutedCommands(){
        return this.commands;
    }

    /**
     * Function to get last executed command
     * @returns {*}
     */
    getLastCommand(){
        return this.commands.head();
    }

    /**
     * Function to execute command, meaning adding it to the stack, and applying the translation
     * vector to the scene element.
     * @param cmd
     */
    executeCommand(cmd) {
        this.addExecutedCommand(cmd);
        switch(cmd._command.cmd){
            case "dx":
                this.velocity = { x: cmd._args / VELOCITY_FACTOR };
                break;
            case "dy":
                this.velocity = { z: cmd._args / VELOCITY_FACTOR };
                break;
        }
    }

    get position(){
        return this.sceneElement.body.position;
    }

    set position(options){
        this.sceneElement.setPosition(options);
    }

    get velocity(){
        return this.sceneElement.velocity;
    }

    set velocity(velocity){
        if(velocity){
            this.sceneElement.setVelocity(velocity);
        }
    }

    checkExecution(cmd) {
        if(cmd._command.cmd === "dx")
            return cmd._args === (this.velocity.x * VELOCITY_FACTOR);
        if(cmd._command.cmd === "dy")
            return cmd._args === (this.velocity.x * VELOCITY_FACTOR);
        else
            return this.getLastCommand().equals(cmd);
    }

    checkVelocityExecution(axis, value){

    }
}
module.exports = Robot;