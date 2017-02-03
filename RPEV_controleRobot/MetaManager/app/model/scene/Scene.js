"use strict";
var MetaManager = require('../MetaManager');
var SceneRenderer = require('./SceneRenderer');
var Physics = require('./Physics');
var SceneElement = require('./SceneElement');
var Vec3 = require('../Utility').Vector;

/**
 * Main class used to manage the scene. It makes communication between CannonJS for the physics and
 * ThreeJS for the rendering.
 */
class Scene{


    constructor(canvas){
        this.physics = new Physics({ gravX: 0, gravY: 0, gravZ: 0});
        this.renderer = new SceneRenderer(canvas);


        this.renderer.setCamera(30, canvas.width / canvas.height, 10, 1e7, new Vec3(100, 50, 100));
        this.renderer.addTrackballControls();
        this.renderer.addLight({ type: "ambient", color:0x666666});
        //this.renderer.addLight({ type:"directional", color: 0xffffff, intensity:2, x:-50, y:0, z:0});
        this.renderer.addLight({type: "spot", color: 0xffffff, intensity:1, x:50, y:50, z:50, tx:50, ty:0, tz:50});

        //Here to improve view, but don't know why it removes colors and shapes bounds are strange.
        //this.renderer.initPostprocessing();

        this.elements = [];

        //Adjusting the scene limits (meaning the box of the supervisor)
        this.createLimits(500);

        this.physics.addMaterial("no_special");
        this.physics.addContactMaterial("no_special", "no_special", 0, 0);

        this.physics.addMaterial("friction");
        this.physics.addContactMaterial("friction", "friction", 0.2);
    }

    /**
     * Creates a shape according to a certain size, used to create bounds of the scene
     * @param size
     * @param shape
     */
    createLimits(size, shape){
        if(this.limits){
            this.renderer.removeMesh(this.limits);
        }
        if(size) {
            this.limits = SceneElement.createLimits(size.x, shape);
            this.renderer.addMesh(this.limits);
        }
    }

    /**
     * Function to add an element to the scene. It will create the mesh and the body. If you provide an element,
     * it will juste add it.
     * @param options
     * @returns {*}
     */
    addElement(options){
        var element;

        if(!options.element) {
            element = new SceneElement();

            element.setBody({
                mass: options.body.mass,
                type: options.body.type,
                values: options.body.values,
                position: options.body.position,
                material: this.physics.getMaterial(options.body.material)
            });

            element.setMesh({
                material: {
                    type: options.mesh.materialType,
                    color: options.mesh.color,
                    wireframe: options.mesh.wireframe
                },
                type: options.mesh.type,
                width: options.mesh.width || options.body.values.width * 2,
                height: options.mesh.height || options.body.values.height * 2,
                depth: options.mesh.depth || options.body.values.depth * 2,
                widthSeg: options.mesh.widthSeg,
                heightSeg: options.mesh.heightSeg,
                castShadow: options.mesh.castShadow,
                receiveShadow: options.mesh.receiveShadow
            });
        }else{
            element = options.element;
            element.body.material = this.physics.getMaterial("no_special");

        }

        this.elements.push(element);
        this.physics.addBody(element.body);
        this.renderer.addMesh(element.mesh);

        return element;
    }

    /**
     * Removes an element from the physics and the renderer, but does not erase it.
     * @param element
     */
    removeElement(element){
        this.physics.removeBody(element.body);
        this.renderer.removeMesh(element.mesh);
    }

    /**
     * Function called at each tick, used to make the world working.
     */
    play(){
        //Here the physics
        this.physics.step();

        //Make what you want here
        for(let i = 0;i < this.elements.length;i++) {
            this.elements[i].updatePositions();
            this.elements[i].keepVelocity();
        }

        //Let the AI analyse things
        MetaManager.stepSupervisor();

        //And finally render scene
        this.renderer.render();
    }
}
module.exports = Scene;