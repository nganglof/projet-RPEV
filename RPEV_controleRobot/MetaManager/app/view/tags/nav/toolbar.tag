<toolbar>
    <header id="menu-bar" class="titlebar toolbar toolbar-header">
        <div id="act-btns" style="float:left; position:absolute;left:10px;font-size:16px;">
            <a id="btn-close" onclick={ toggleAction }><span class="icon icon-record main-btn"></span></a>
            <a id="btn-reduce" onclick={ toggleAction }><span class="icon icon-record main-btn" onclick={ toggleAction }></span></a>
            <a id="btn-max" onclick={ toggleAction }><span class="icon icon-record main-btn" ></span></a>
        </div>
        <h1 class="title">MetaManager</h1>

        <!-- Actions to change windows -->
        <div class="toolbar-actions" style="margin-left:20%;">
            <menu></menu>
        </div>

        </div>

    </header>

    <script>
        const remote = require('electron').remote;
        var Renderer = require('./../Renderer').Renderer;
        var Controller = require('../../../controller/Controller');

        //options
        this.active = opts.active;
        this.devices = opts.devices;
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

        //Functions for buttons
        this.show = function(e){
            document.getElementById(self.active).classList.remove("active");
            self.active = e.currentTarget.id;
            e.currentTarget.classList.add("active");
            Renderer.showWindow(e.currentTarget.id);
            if(e.currentTarget.id == "scene") Controller.unpauseWorldAndAnimations();
            else Controller.pauseWorldAndAnimations();
        };

        document.addEventListener('devicesUpdate', function(e){
            self.update({devices: Array.from(BluetoothManager.getDevices())});
        });
    </script>
</toolbar>