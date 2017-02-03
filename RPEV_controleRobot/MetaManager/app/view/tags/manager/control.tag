<script src="../../../model/Utility.js"></script>
<script src="../../../model/supervisor/Supervisor.js"></script>
<control class="full">

    <div class="col-md-12">
        <h2>Entity { entity.robot.name }</h2>
    </div>

    <div class="col-xs-12">
        <h4>Edit entity properties</h4>
    </div>
    <div class="col-xs-12 separator"></div>

    <div class="col-xs-6" style="border-right:1px solid #BFBFBF;">
        <button class="btn btn-large btn-warning" onclick={ editEntity }>Edit this entity</button>
        <button class="btn btn-large btn-negative" onclick={ removeEntity }>Remove this entity</button>
    </div>
    <div class="col-xs-6">
        <button if={ this.entity.robot.started } class="btn btn-large btn-primary" onclick={ askCurrentValues }>Update current values</button>
        <button if={ this.entity.robot.started } class="btn btn-large btn-negative" onclick={ toggleRobotState }>Stop robot</button>
        <button if={ !this.entity.robot.started } class="btn btn-large btn-positive" onclick={ toggleRobotState }>Start robot</button>
        <button if={ !this.entity.device.isOSCListening() } class="btn btn-large btn-positive" onclick={ toggleOSC }>Listen on OSC</button>
        <button if={ this.entity.device.isOSCListening() } class="btn btn-large btn-warning" onclick={ toggleOSC }>Stop listening on OSC</button>
    </div>
    <div class="separator col-xs-12"></div>
    <hr style="width:70%;">

    <div class="col-md-12">
        <h4>Robot properties</h4>
    </div>

    <div class="col-xs-12 separator"></div>

    <div class="col-md-12 form-group">
        <div class="col-xs-6" style="border-right:1px solid #BFBFBF;">
            <div class="row" each={ this.control_datas.ranges } style="margin-bottom: 20px;">
                <label for={ name } class="input-title">{ description }</label>
                <input id={ name } name={ name } type="range" min={ min } max={ max } value={ this.entity.robot._values[name] } oninput={ onInput } >
                <div class="input-values">
                    <div class="col-md-4" style="text-align: left;">{ min }</div>
                    <div class="col-md-4">{ this.entity.robot._values[name] }</div>
                    <div class="col-md-4" style="text-align: right;">{ max }</div>
                </div>
            </div>
            <div class="col-md-12" style="margin-top: 30px;">
                <button class="btn btn-default btn-large" onclick={ setDefault }>Set values as default</button>
                <button class="btn btn-warning btn-large" onclick={ restoreDefault }>Restore default values</button>
                <div class="col-md-12">
                    <p><span class="icon icon-attention"></span> Defaults values are globally stored</p>
                </div>
            </div>
        </div>
        <div class="col-xs-6">
            <div class="row">
                <label class="input-title">Position (x, y, z)</label>
                <div class="col-md-12 position-inputs">
                    <input class="form-control" name="x" type="number" placeholder="x" value={ this.entity.robot.position.x }>
                    <input class="form-control" name="y" type="number" placeholder="y" value={ this.entity.robot.position.y }>
                    <input class="form-control" name="z" type="number" placeholder="z" value={ this.entity.robot.position.z }>
                </div>
            </div>
            <button class="btn btn-primary btn-large" style="margin-top:20px;" onclick={ changePosition }>Change position</button>

        </div>
    </div>







    <script>
        var Controller = require('../../../controller/Controller');
        const {dialog} = require('electron').remote;

        this.onInput = function(e){
            this.entity.modifyRobotBasicValue(this.name, parseInt(this[this.name].value));
        };

        this.changePosition = function(e){
            this.entity.robot.position = {x: parseInt(this.x.value), y: parseInt(this.y.value), z:parseInt(this.z.value) };
        };

        this.toggleRobotState = function(e){
            this.entity.toggleRobotState();
        };

        ////////Edit, remove and listen/////////
        this.removeEntity = function(e){
            var self = this;
            dialog.showMessageBox({type: 'warning', buttons:['yes', 'no'], title:'Warning', message:'Do you really want to remove this entity ?'},
                    function(response){
                    if(response === 0){
                        Controller.removeEntity(self.entity.id);
                        document.dispatchEvent(new Event('entities_update'));
                        document.dispatchEvent(new Event('home_pane'));
                    }
            });
        };

        this.editEntity = function(e){
            document.dispatchEvent(new Event('edit_pane'));
        };


        this.toggleOSC = function(e){
            Controller.switchEntityOSCListening(this.entity.id);
        };
        /////////////////////////////////////////

        ///////About default values///////
        this.setDefault = function(e){
            for(let i = 0;i<this.control_datas.ranges.length;i++){
                this.control_datas.ranges[i].init_value = this[this.control_datas.ranges[i].name].value;
            }
        };

        this.restoreDefault = function(e){
            for(let i = 0;i<this.control_datas.ranges.length;i++){
                this[this.control_datas.ranges[i].name].value = this.control_datas.ranges[i].init_value;
                this.entity.modifyRobotBasicValue(this.control_datas.ranges[i].name, parseInt(this.control_datas.ranges[i].init_value));
            }
        };

        this.askCurrentValues = function(e){
            //document.getElementById("loading").style.display="flex";
            var self = this;
            Controller.requestRobotInfo(self.entity.id);

            //TODO if triggered notice it to the user
            setTimeout(function(e){
                if(self.entity.askingInformations === true){
                    //document.getElementById("loading").style.display="none";
                    self.entity.robot.valuesQty = 0;
                    self.entity.robot.hasBeenUpdated();
                    self.update();
                }
            }, 3000);
        };
        /////////////////////////////////


        this.on('update', function(){
            if(this.entity){
                if(this.control_datas)
                    this.control_datas = undefined;
                var temp_datas = Controller.packageRangeControlDatas(this.entity.id);
                this.control_datas = {ranges: [], texts: []};
                for(let val of temp_datas){
                    if(val.type === "range"){
                        this.control_datas.ranges.push(val);
                    }else if(val.type === "text"){
                        this.control_datas.texts.push(val);
                    }
                }
            }
        });


    </script>

    <style>



        .input-values{
            width:65%;
            margin:0 auto;
        }

        .row input[type=range]{
            width:60%;
        }

        .row input, .row select{
            width:50%;
            text-align:center;
        }

        .row input[type=checkbox]{
            width:auto;
        }

        hr{
            margin:0 auto;
            width:80%;
            border: 0;
            height: 1px;
            background-color: #bfbfbf;
        }

        .position-inputs input{
            width:25%;
            margin-right:10px;
        }

    </style>

</control>