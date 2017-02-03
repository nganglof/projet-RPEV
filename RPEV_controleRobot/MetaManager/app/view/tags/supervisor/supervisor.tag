<supervisor class="pane full normal-bg">

    <div class="col-md-12">
        <h2>Supervisors</h2>
    </div>

    <hr>
    <div class="col-md-12 separator"></div>

    <div class="col-md-6" style="border-left:1px solid #BFBFBF;">
        <div class="col-md-12">
            <h5>Add a supervisor</h5>
        </div>
        <div class="col-md-12 separator"></div>

        <form class="form-group col-md-12">
            <div class="row">
                <label for="name" class="input-title">Supervisor name</label>
                <input type="text" class="form-control" id="name" name="name">
            </div>
            <div class="row">
                <label for="ground" class="input-title">Ground size of the scene (in mm)</label>
                <input type="text" class="form-control" id="ground" name="ground">
            </div>
            <div class="row">
                <label for="type" class="input-title">Supervisor type</label>
                <select class="form-control" id="type" name="type">
                    <option each={ this.types }>{ name }</option>
                </select>
            </div>

            <div class="col-md-12">
                <h5>OSC communication (i-score)</h5>
                <div class="col-md-12 separator"></div>
                <div class="row" style="margin-top:30px;">
                    <label for="address" class="input-title">Address to listen for the OSC listener</label>
                    <input class="form-control" type="text" id="address" name="address" value="127.0.0.1">
                </div>
                <div class="row">
                    <label for="port" class="input-title">Socket to listen to</label>
                    <input class="form-control" type="text" id="port" name="port" placeholder="A random number > 1024">
                </div>
            </div>

            <div class="col-md-12">
                <button class="btn btn-large btn-primary" onclick={ add }>Add supervisor !</button>
            </div>
        </form>
    </div>

    <div class="col-md-6">
        <div class="col-md-12">
            <h5>Change supervisor</h5>
        </div>
        <div class="col-md-12 separator"></div>

        <form class="form-group col-md-12">
            <div class="row">
                <select class="form-control" id="selected_sup" name="selected_sup" onchange={ select }>
                    <option>none</option>
                    <option each={ this.supervisors }>{ name }</option>
                </select>
            </div>
            <div class="col-md-12" show={ this.selected }>
                <div class="row">
                    <label for="selected_name" class="input-title">Name</label>
                    <input class="form-control" type="text" id="selected_name" name="selected_name" value={ this.selected.name }>
                </div>
                <div class="row">
                    <label for="selected_port" class="input-title">OSC Port listening</label>
                    <input class="form-control" type="text" id="selected_port" name="selected_port" value={ this.selected.device.devices.osc.port }>
                </div>
                <div class="row">
                    <label for="selected_address" class="input-title">OSC Address listening</label>
                    <input class="form-control" type="text" id="selected_address" name="selected_address" value={ this.selected.device.devices.osc.address }>
                </div>
                <div class="row">
                    <h6>Controlled entities</h6>
                    <div class="col-md-12">
                        <label for="default_add">Automatically add to control newly created entities ?
                            <input type="checkbox" class="form-group" id="default_add" name="default_add" checked={ this.selected.add_new_robot } onchange={ toggle_default_add }>
                        </label>

                    </div>
                    <table class="table-striped" id="entities_list">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th onclick={ toggle_select_all } >Selected</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr each={ this.entities }>
                                <td>{ id }</td>
                                <td>{ robot.name }</td>
                                <td><input type="checkbox" class="form-control" onchange={ select_entity } checked={ checked }></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </form>
    </div>

    <script>
        var Controller = require('../../../controller/Controller');

        var self = this;

        this.all_checked = true;

        //////////////////////Creation and selection//////////////
        this.select = function(e){
            if(e.currentTarget.value !== "none") {
                for (let item of this.supervisors) {
                    if (item.name === e.currentTarget.value) {
                        this.selected = item;
                        Controller.setSupervisor(this.selected.name);
                    }
                }
                this.update();
            }else{
                this.selected = undefined;
                Controller.setSupervisor(undefined);
                this.update();
            }
        };

        this.add = function(e){
            let sup = Controller.addSupervisor(this.type.value, this.name.value, parseInt(this.ground.value));
            sup.setUp({address: this.address.value, port: this.port.value});
            //Controller.setSupervisor(sup.name);
            this.update();
        };
        ////////////////////////////////////////////////////////
        //////////////////////Edition///////////////////////////
        this.toggle_select_all = function(e){
            this.all_checked = !this.all_checked;
            let rows = this.entities_list.rows;
            for(let i=1;i<rows.length;i++){
                rows[i].cells[2].childNodes[0].checked = this.all_checked;
            }
        };

        this.toggle_default_add = function(e){
            this.selected.toggleAddByDefault();
        };

        this.select_entity = function(e){
            if(this.selected.has(this._item.id) && e.currentTarget.checked === false){
                this.selected.removeRobot(this._item.id);
            }else{
                this.selected.addRobot(this._item.id);
            }
        };
        ///////////////////////////////////////////////////////

        this.on('update', function(){
            this.types = Controller.getSupervisorsTypes();
            this.supervisors = Controller.getSupervisors();
            //if(this.supervisors.length === 1) this.selected = this.supervisors[0];
            if(this.selected){
                this.entities = Controller.getEntities();
                for(let ent of this.entities){
                    ent.checked = this.selected.has(ent.id);
                }
            }
        });

        document.addEventListener('entities_update', function(){
            self.update();
        });
    </script>
    <style>

    </style>

</supervisor>