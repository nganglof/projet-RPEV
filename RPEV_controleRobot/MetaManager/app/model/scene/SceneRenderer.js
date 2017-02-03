"use strict";
var Three = require('three');
require('./dependencies');

var self;

class SceneRenderer{

    constructor(canvas){
        self = this;

        this.scene = new Three.Scene();
        //this.scene.fog = new Three.Fog( 0x000000, 0, 1000 );

        this.canvas = typeof canvas === "string" ? document.getElementById(canvas) : canvas;

        this.renderer = new Three.WebGLRenderer({ canvas: this.canvas });
        this.resize();

        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.shadowMap.enabled = true;
        //this.renderer.setClearColor( this.scene.fog.color, 1 );
    }

    resize(){
        //this.camera.updateProjectionMatrix();

        this.canvas.width = this.canvas.offsetParent.offsetWidth;
        this.canvas.height = this.canvas.offsetParent.offsetHeight;

        this.renderer.setSize( this.canvas.width, this.canvas.height );
    }

    setCamera(fov, aspect, near, far, position){
        this.camera = new Three.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(position.x, position.y, position.z);
        this.scene.add(this.camera);
    }

    addTrackballControls(){
        this.controls = new Three.TrackballControls( this.camera , this.canvas);
        this.controls.target.set(0, 0, 0);
    }

    //TODO needs to be changed/enlighted
    addLight(options){
        var light;
        switch(options.type){
            case "ambient":
                light = new Three.AmbientLight(options.color);
                break;
            case "directional":
                light = new Three.DirectionalLight(options.color, options.intensity);
                var d = 50;

                light.position.set(options.x || d, options.y || d, options.z || d );
                light.castShadow = true;
                //light.cameraHelper = true;

                light.shadow.mapWidth = 1024;
                light.shadow.mapHeight = 1024;

                light.shadow.camera.left = -d;
                light.shadow.camera.right = d;
                light.shadow.camera.top = d;
                light.shadow.camera.bottom = -d;

                light.shadow.camera.far = 3*d;
                light.shadow.camera.near = d;
                light.shadow.darkness = 0.5;
                break;
            case "point":
                light = new Three.PointLight(options.color, options.intensity);

                light.position.set(options.x, options.y, options.z);
                light.castShadow = true;

                break;
            case "spot":
                light = new Three.SpotLight( options.color, options.intensity );

                light.position.set( options.x, options.y, options.z );
                light.target.position.set( options.tx || 0, options.ty || 0, options.tz || 0 );

                light.castShadow = true;
        }

        this.scene.add( light );
    }

    addMesh(mesh){
        this.scene.add(mesh);
    }

    removeMesh(mesh){
        if(mesh)
            this.scene.remove(mesh);
    }

    initPostprocessing(){
        // Setup render pass
        this.renderPass = new Three.RenderPass( this.scene, this.camera );

        // Setup depth pass
        this.depthMaterial = new Three.MeshDepthMaterial();
        this.depthMaterial.depthPacking = Three.RGBADepthPacking;
        this.depthMaterial.blending = Three.NoBlending;

        //this.depthRenderTarget = new Three.WebGLRenderTarget( this.canvas.width, this.canvas.height);

        // Setup SSAO pass
        this.ssaoPass = new Three.ShaderPass( Three.SSAOShader );
        this.ssaoPass.renderToScreen = true;
        //ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
        //this.ssaoPass.uniforms[ "tDepth" ].value = this.depthRenderTarget.texture;
        this.ssaoPass.uniforms[ 'size' ].value.set( this.canvas.width, this.canvas.height );
        this.ssaoPass.uniforms[ 'cameraNear' ].value = this.camera.near;
        this.ssaoPass.uniforms[ 'cameraFar' ].value = this.camera.far;
        this.ssaoPass.uniforms[ 'onlyAO' ].value = true;
        this.ssaoPass.uniforms[ 'aoClamp' ].value = 0.3;
        this.ssaoPass.uniforms[ 'lumInfluence' ].value = 0.5;

        // Add pass to effect composer
        this.effectComposer = new Three.EffectComposer( this.renderer );
        this.effectComposer.addPass( this.renderPass );
        this.effectComposer.addPass( this.ssaoPass );
    }

    render(){
        this.controls.update();

        // Render depth into depthRenderTarget
        if(this.depthMaterial) {
            scene.overrideMaterial = this.depthMaterial;
            this.renderer.render(this.scene, this.camera, this.depthRenderTarget, true);
        }else{
            this.renderer.render(this.scene, this.camera);
        }

        // Render renderPass and SSAO shaderPass
        if(this.effectComposer){
            scene.overrideMaterial = null;
            this.effectComposer.render();
        }
    }
    
}
module.exports = SceneRenderer;