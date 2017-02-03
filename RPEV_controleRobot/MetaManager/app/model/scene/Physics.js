"use strict";
var Cannon = require('cannon');

class Physics{

    constructor(options){
        this.world = new Cannon.World();
        this.world.gravity.set(options.gravX || 0, options.gravY || -9.82 , options.gravZ || 0);
        this.world.broadphase = new Cannon.NaiveBroadphase();
        this.world.solver.iterations = 10;

        this.timeStep = options.timeStep || 1.0 / 60.0;

        this.materials = new Map();
    }

    addBody(body){
        this.world.addBody(body);
    }

    removeBody(body){
        if(body)
            this.world.removeBody(body);
    }

    addMaterial(name){
        this.materials.set(name, new Cannon.Material(name));
    }

    getMaterial(name){
        return this.materials.get(name);
    }

    addContactMaterial(first, second, friction = 0.4, restitution = 0.0){
        var firstMat = this.materials.get(first);
        var secondMat = this.materials.get(second);

        this.world.addContactMaterial(new Cannon.ContactMaterial(firstMat, secondMat, {
            friction: friction,
            restitution: restitution
        }))
    }

    step(){
        this.world.step(this.timeStep);
    }

}
module.exports = Physics;
