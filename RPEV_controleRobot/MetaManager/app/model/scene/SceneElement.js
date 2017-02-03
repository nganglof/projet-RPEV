"use strict";
var Three = require('three');
var Cannon = require('cannon');

/**
 * Class to gather physics and graphics. A scene element is a body and a mesh.
 */
class SceneElement{
    constructor(){

    }

    /**
     * Function to create a body for a scene element. Needs a position, a mass, and accordingly to a type, a radius or
     * a width and height.
     * @param options
     */
    setBody(options){
        var body = new Cannon.Body({
            mass: options.mass,
            type: Cannon.Body.DYNAMIC
        });

        if(options.position){
            body.position.x = options.position.x || body.position.x;
            body.position.y = options.position.y || body.position.y;
            body.position.z = options.position.z || body.position.z;
        }

        if(options.material){
            body.material = options.material;
        }


        switch(options.type){
            case "sphere":
                body.addShape(new Cannon.Sphere(options.values.radius));
                this.type = "drone";
                break;
            case "cube":
                body.addShape(new Cannon.Box(new Cannon.Vec3(options.values.width, options.values.height, options.values.depth)));
                this.type = "robot";
                break;
            case "plane":
                body.addShape(new Cannon.Plane());
                body.quaternion.setFromAxisAngle(new Cannon.Vec3(1,0,0),-Math.PI/2);
                this.type = "ground";
                break;
            default:
                body.addShape(new Cannon.Box(new Cannon.Vec3(1,1,1)));
        }

        this.body = body;
        this.velocity = {x:0, y:0, z:0};

        this.body.parent = this;

        this.body.addEventListener("collide" , this.onCollide);
    }

    /**
     * Function to set the mesh of an element. Needs a material type and a color. Also accordingly to a type, a height,
     * width.
     * @param options
     */
    setMesh(options){
        var geometry, material;


        switch(options.material.type){
            case "basic":
                material = new Three.MeshBasicMaterial({color: options.material.color, wireframe: options.material.wireframe});
                break;
            case "lambert":
                material = new Three.MeshLambertMaterial( { color: options.material.color } );
                break;
            case "phong":
                material = new Three.MeshPhongMaterial( { color: options.material.color } );

                break;
        }

        switch(options.type){
            case "box":
                geometry = new Three.BoxGeometry(options.width, options.height, options.depth, options.widthSeg, options.heightSeg);
                break;
            case "cube":
                geometry = new Three.CubeGeometry(options.width, options.height, options.depth, options.widthSeg, options.heightSeg);
                break;
            case "plane":
                geometry = new Three.PlaneGeometry(options.width, options.height, options.widthSeg, options.heightSeg);
                break;
        }

        this.geometry = geometry;
        this.material = material;
        this.mesh = new Three.Mesh(geometry, material);
        if(options.castShadow === true)
            this.mesh.castShadow = true;
        if(options.receiveShadow === true)
            this.mesh.receiveShadow = true;

        this.color = options.material.color;
    }

    /**
     * Function called when two bodies will collide.
     * @param e
     */
    onCollide(e){
        //Do what ya want here with the ContactEquation
        this.parent.setVelocity({x: Math.trunc(this.parent.velocity.x), y:Math.trunc(this.parent.velocity.y)
            , z:Math.trunc(this.parent.velocity.z)});

        document.dispatchEvent(new Event('contact_update'));
    }

    /**
     * Function to match physics positions to 3D scene positions
     */
    updatePositions(){
        //Update mesh positions
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

    /**
     * Function to keep velocity relatively to the one of the physics element.
     */
    keepVelocity(){
        if(this.velocity) {
            this.body.velocity.x = this.velocity.x;
            this.body.velocity.y = this.velocity.y;
            this.body.velocity.z = this.velocity.z;
        }
    }

    /**
     * Setter of velocity
     * @param options
     */
    setVelocity(options){
        if(options){
            this.body.velocity.x = this.velocity.x = options.x || options.x === 0 ? options.x : this.body.velocity.x;
            this.body.velocity.y = this.velocity.y = options.y || options.y === 0 ? options.y : this.body.velocity.y;
            this.body.velocity.z = this.velocity.z = options.z || options.z === 0 ? options.z : this.body.velocity.z;
        }
    }

    getVelocity(){
        return this.body.velocity;
    }

    setColor(color){
        this.color = color;
        this.material.color = new Three.Color(color);
    }

    setPosition(position){
        if(position){
            this.body.position.x = position.x || position.x ===  0 ? position.x : this.body.position.x;
            this.body.position.y = position.y || position.y ===  0 ? position.y : this.body.position.y;
            this.body.position.z = position.z || position.z ===  0 ? position.z : this.body.position.z;
        }
    }

    /**
     * Function to create bounds on a scene.
     * @param size
     * @param shape
     * @returns {THREE.Line}
     */
    static createLimits(size, shape){
        var material = new Three.LineBasicMaterial({
            color: 0x0000ff
        });
        var geometry = new Three.Geometry();
        geometry.vertices.push(new Three.Vector3(-size, 0.9 , size));
        geometry.vertices.push(new Three.Vector3(-size, 0.9 , -size));
        geometry.vertices.push(new Three.Vector3(size, 0.9 , -size));
        geometry.vertices.push(new Three.Vector3(size, 0.9 , size));
        geometry.vertices.push(new Three.Vector3(-size, 0.9 , size));

        return new Three.Line(geometry, material);
    }
}
module.exports = SceneElement;