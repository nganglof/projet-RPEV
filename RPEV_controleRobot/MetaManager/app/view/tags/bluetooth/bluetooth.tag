<bluetooth class="pane normal-bg full">

    <div class="col-md-12">
        <h2>Bluetooth devices management</h2>
    </div>

    <hr >
    <div class="col-md-12 separator"></div>

    <div class="col-md-8 col-md-offset-2">
        <button class="btn btn-large btn-primary" onclick={ discover }>Start discovery</button>
        <p>
            <span class="icon icon-attention" style="margin-left:10px;"></span> During discovery, the application may not respond for approximately 20 seconds.
        </p>
    </div>

    <div class="col-md-12 separator"></div>

    <div class="col-md-3 col-md-offset-2 bt-list no-padding">
        <ul class="list-group">
            <li class="list-group-item bt-list-item" each={ devices } onclick={ select }>
                <span if={ connected && !connecting } class="media-object pull-left icon icon-record" style="color:#34c84a;"></span>
                <span if={ connecting } class="media-object pull-left icon icon-record" style="color:#fdbc40;"></span>
                <span if={ !connected && !connecting } class="media-object pull-left icon icon-record" style="color:#fc605b;"></span>
                <div class="media-body">
                    <strong>{ name }</strong>
                    <p>{ connecting ? "Connecting ..." : connected ? "Connected" : "Not connected" }</p>
                </div>
            </li>
        </ul>
        <div class="col-md-12 bt-list-bottom">
            <div class="col-md-4 bottom-list-item">
            </div>
        </div>
    </div>

    <div class="col-md-6 bt-descr">
        <div class="col-md-4 no-padding" style="text-align: right;margin-top:40px;">
            <div style="height:40px;">
                Name :
            </div>
            <div style="height:150px;">
                State :
            </div>
            <div  if={ this.selected.last_connection } style="height:40px">
                Last connection :
            </div>
            <div style="height:40px">
                Number of tries to connect :
            </div>
        </div>
        <div class="col-md-8" style="text-align: left;margin-top:40px;">
            <div style="height:40px">
                <strong>{ this.selected.name }</strong>
            </div>
            <div style="height:150px;">
                <strong>{ this.selected.connected ? "Connected" : "Not connected" }</strong> <br>
                <div style="text-align: justify;font-size:12px;">
                    <span if={ this.selected.connected }> Application is connected to
                        this Bluetooth Device whose MAC address is { this.selected.address } </span>
                </div>
            </div>
            <div if={ this.selected.last_connection } style="height:40px;">
                <strong>{ this.selected.last_connection.toString() }</strong>
            </div>
            <div style="height:40px;">
                <strong>{ this.selected.tries }</strong>
            </div>
        </div>
        <div class="col-md-12 connect-div">
            <button class="btn btn-large btn-default" onclick={ connect } if={ !this.selected.connecting && !this.selected.connected }>Connect</button>
            <button class="btn btn-large btn-default" if={ this.selected.connecting } disabled>Connecting ...</button>
            <button class="btn btn-large btn-default" onclick={ disconnect } if={ !this.selected.connecting && this.selected.connected }>Disconnect</button>
        </div>
    </div>


    <script>
        var BluetoothManager = require('../../../model/devices/BluetoothManager');

        var self = this;
        this.selected = undefined;

        this.select = function(e){
            setActive(e.currentTarget);
            this.parent.selected = this._item;
            this.update();
        };

        this.connect = function(e){
            BluetoothManager.connectDevice(this.selected.address);
            this.update();
        };

        this.disconnect = function(e){
            BluetoothManager.disconnectDevice(this.selected.address);
            this.update();
        };

        this.discover = function(e){
            BluetoothManager.startDiscovery();
        };

        function setActive(element){
            var items = document.getElementsByClassName('bt-list-item');
            for(let i = 0;i<items.length;i++){
                items[i].classList.remove('active');
            }

            element.classList.add('active');
        }

        this.on('update', function(){
            this.devices = Array.from(BluetoothManager.getDevices());
        });

        this.on('mount', function(){
            /*if(!this.selected && this.devices.length > 0){
                document.getElementsByClassName('bt-list-item')[0].classList.add('active');
                this.selected = this.devices[0];
                this.update();
            }*/
        });

        document.addEventListener('devicesUpdate', function(){ self.update(); })


    </script>

    <style>

        .connect-div{
            position: absolute;
            bottom: 20px;
            left: 0;
            text-align: right;
        }

        .no-padding{
            padding:0;
        }

        .bt-list-bottom{
            height:15px;
            bottom:0;
        }

        .bottom-list-item{
            border-left:1px solid #989698;
        }

        .bt-list{
            background-color: white;
            border:1px solid darkgrey;
            height:70%;
            max-width:255px;
        }

        .bt-descr{
            margin-left:40px;
            float:left;
            height:70%;
            max-width:800px;
            border:1px solid lightgrey;
            background-color: #DCDCDC;
        }

        .bt-list .list-group-item{
            border:none;
            text-align:left;
        }

    </style>
</bluetooth>