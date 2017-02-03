<menu>
    <div class="btn-group">
        <button id="scene" class="btn btn-default active" onclick={ changeWindow }>
            <span class="icon icon-note"></span>
            Scene
        </button>
        <button id="manager" class="btn btn-default" onclick={ changeWindow }>
            <span class="icon icon-network"></span>
            Entities
        </button>
        <button id="bluetooth" class="btn btn-default" onclick={ changeWindow }>
            <span class="icon icon-signal"></span>
            Bluetooth
        </button>
        <button id="supervisor" class="btn btn-default" onclick={ changeWindow }>
            <span class="icon icon-eye"></span>
            Supervisor
        </button>
    </div>


    <button if={ this.active.id === 'manager' } class="btn btn-primary" onclick={ addEntity }>Add an entity</button>



    <script>
        const remote = require('electron').remote;
        var Renderer = require('./../Renderer').Renderer;
        var Controller = require('../../../controller/Controller');
        var Creation = require('../../js/Creation');

        //options
        this.active = opts.active;
        var self = this;


        this.toggleAction = function(e){
            var window = remote.getCurrentWindow();
            switch(e.currentTarget.id){
                case "btn-close":
                    window.close();
                    break;
                case "btn-reduce":
                    window.minimize();
                    break;
                case "btn-max":
                    if (!window.isMaximized()) {
                        window.maximize();
                    } else {
                        window.unmaximize();
                    }
                    break;
            }
        };

        this.addEntity = function(e){
            document.dispatchEvent(new Event("add_pane"));
        };

        //Functions for buttons
        this.changeWindow = function(e){
            //Changing active menu item
            toggle(this.active, "active");
            self.active = e.currentTarget;
            toggle(this.active, "active");

            //Changing window
            Renderer.showWindow(e.currentTarget.id);

            //for optimization
            if(e.currentTarget.id == "scene") Controller.unpauseWorldAndAnimations();
            else Controller.pauseWorldAndAnimations();
        };

        function toggle(element, property){
            if(element.classList.contains(property)){
                element.classList.remove(property);
            }else{
                element.classList.add(property);
            }
        }

        this.on('mount', function(){
            this.active = document.getElementById(this.active);
            this.update();
        })
    </script>

    <style>
        menu span{
            margin-right:5px;
        }
    </style>
</menu>