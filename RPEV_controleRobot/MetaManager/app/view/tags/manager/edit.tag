<edit class="full">

    <form id="form" class="form-group padded-less">

        <div class="col-md-12">
            <h2>Edit { entity.robot.name }</h2>
        </div>

        <div class="col-md-12 separator"></div>

        <div class="col-md-12">
            <label for="name" class="input-title">Name of the entity</label>
            <input class="form-control" style="width:25%;" type="text" id="name" name="name" placeholder="It's always hard to find a name ...">
        </div>
        <div class="col-md-12 separator"></div>

        <hr>
        <div class="col-md-12 separator"></div>


        <div class="col-md-12">
            <div class="col-md-6" style="border-right:1px solid #BFBFBF;">
                <div class="col-md-12">
                    <h5>Information about the robot</h5>
                    <div class="col-md-12 separator"></div>
                    <div class="row" style="margin-top:30px;">
                        <label for="rwidth" class="input-title">Width of the robot (in cm)</label>
                        <input class="form-control" type="number" id="rwidth" name="rwidth">
                    </div>
                    <div class="row">
                        <label for="rheight" class="input-title">Height of the robot (in cm)</label>
                        <input class="form-control" type="number" id="rheight" name="rheight">
                    </div>
                    <div class="row">
                        <label for="legs" class="input-title">Number of legs</label>
                        <input class="form-control" type="number" id="legs" name="legs" placeholder="We really don't care about this ...">
                    </div>
                </div>
                <div class="col-md-12">
                    <h5>3D Scene reproduction</h5>
                    <div class="col-md-12 separator"></div>
                    <div class="row" style="margin-top: 30px;">
                        <label for="color" class="input-title">Color of the robot</label>
                        <input type="color" name="color" id="color" style="height:20px;">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="col-md-12">
                    <h5>OSC communication (i-score)</h5>
                    <div class="col-md-12 separator"></div>
                    <div class="row" style="margin-top:30px;">
                        <label for="address" class="input-title">Address to listen for the OSC listener</label>
                        <input class="form-control" type="text" id="address" name="address">
                    </div>
                    <div class="row">
                        <label for="port" class="input-title">Socket to listen to</label>
                        <input class="form-control" type="text" id="port" name="address" placeholder="A random number > 1024">
                    </div>
                </div>
                <div class="col-md-12">
                    <h5>Bluetooth communication</h5>
                    <div class="col-md-12 separator"></div>
                    <div class="row" style="margin-top:30px;">
                        <label for="device_select" class="input-title">Select an available Bluetooth Device</label>
                        <select id="device_select" class="form-control">
                            <option if={ this.entity.device.bluetoothDevice } selected>{ this.entity.device.bluetoothDevice.name }</option>
                            <option> None </option>
                            <option each={ devices }>{ name }</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12 separator"></div>
        <div class="col-md-12">
            <div class="col-md-6 col-md-offset-3">
                <button type="submit" class="btn btn-form btn-default" onclick={ reset }>Reset values</button>
                <button type="submit" class="btn btn-large btn-form btn-warning" onclick={ modify } >Modify entity</button>
                <button type="submit" class="btn btn-form btn-default" onclick={ cancel }>Cancel</button>
            </div>
        </div>
    </form>

    <script>
        var Controller = require('../../../controller/Controller');
        var BluetoothManager = require('../../../model/devices/BluetoothManager');
        const {dialog} = require('electron').remote;

        var self = this;

        ////////Modify, reset and cancel///////
        this.cancel = function(e){
            document.dispatchEvent(new Event('control_pane'));
        };

        this.reset = function(e){
            self.update();
        };

        this.modify = function(e){
            if((this.port.value <= 1024 || (Controller.isPortAlreadyTaken(this.port.value)) && this.port.value != this.entity.device.devices.osc.port ) && this.port.value !== ''){
                dialog.showMessageBox({type: 'info', buttons:['Ok'], title:'Cannot edit entity', message:'Port invalid (> 1024 or already taken), please choose another...'});
                this.port.focus();
            } else {
                if (this.name.validity.valid && this.name.value !== "") {
                    var options = {};
                    options.robot = {
                        name: this.name.value,
                        //size: this.size.value,
                        legs: this.legs.value,
                        //circumference: 12, //this.circ.value,
                        color: this.color.value
                    };
                    options.device = {
                        osc: {
                            address: this.address.value,
                            port: this.port.value
                        },
                        bluetooth: {
                            none: this.device_select.value === "None",
                            bluetoothDevice: BluetoothManager.getFromNameOrAddress(this.device_select.value)
                        }
                    };

                    Controller.modifyEntity(options, this.entity.id);
                    this.update();
                    document.dispatchEvent(new Event('entities_update'));
                    document.dispatchEvent(new Event('control_pane'));
                } else {
                    this.name.focus();
                }
            }
        };

        this.on('update', function(){

            this.devices = Array.from(BluetoothManager.getAvailableDevices());

            if(this.entity){
                this.name.value = this.entity.robot.name;
                this.rwidth.value = this.entity.robot.width;
                this.rheight.value = this.entity.robot.height;
                this.legs.value = this.entity.robot.legs;
                this.color.value = this.entity.robot.sceneElement.color;
                this.address.value = this.entity.device.devices.osc.address;
                this.port.value = this.entity.device.devices.osc.port;
                this.device_select.value = this.entity.device.devices.bluetooth ? this.entity.device.devices.bluetooth.name : 'None';
            }
        });
    </script>
    <style>

    </style>
</edit>