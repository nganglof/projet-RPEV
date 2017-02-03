<scene class="pane pane-group full">

    <selection></selection>

    <div class="pane">
        <div class="col-md-12 form-group">
            <div class="row" each={ this.control_datas } style="margin-bottom: 20px;">
                <label for={ name } class="col-md-2">{ description }</label>
                <input class="form-control" id={ name } name={ name } type="range" min={ min } max={ max } oninput={ onInput } >
            </div>
        </div>
        <div class="col-md-12">
            <div class="col-md-6" style="text-align: right;">
                <label for="singlecmd">Enter a custom command</label>
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" id="singlecmd" name="singlecmd" placeholder="dx 10, toggleCrab, dy -5 ...">
            </div>
            <div class="col-md-12">
                <button class="btn btn-primary btn-large" style="margin-left:20px;" onclick={ sendCommand }>Send command</button>
            </div>
        </div>
    </div>
    <div class="pane">
        <canvas id="sceneCanvas" style="border:1px solid lightslategray;"></canvas>
    </div>

    <script>
        var riot = require('riot');
        var Controller = require('../../../controller/Controller');

        this.selectedEntities = [];
        riot.mixin("selected_entities", { selected: this.selectedEntities });

        this.onInput = function(e){
            for(let entity of this.selectedEntities){
                entity.executeCommand({ command: e.currentTarget.value, value: parseInt(e.currentTarget.value)});
            }
        };

        this.sendCommand = function(e){
            for(let entity of this.selectedEntities){
                entity.executeCommand({ command: this.singlecmd.value.split(' ')[0], value: parseInt(this.singlecmd.value.split(' ')[1])});
            }
        };

        this.on('update', function(){
            if(!this.control_datas) {
                var temp_datas = Controller.packageDefaultRangeControlDatas();
                this.control_datas = [];
                for (let val of temp_datas) {
                    if (val.type === "range") {
                        this.control_datas.push(val);
                    }
                }
            }
        });

    </script>

    <style>
    </style>
</scene>