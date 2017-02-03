<search class="pane pane-sm sidebar">
    <ul class="list-group">
        <li class="list-group-header">
            <input name="search_input" class="form-control" type="search" placeholder="Search for an entity" oninput={ do_search }>
        </li>
        <li class="list-group-item entities-list" each={ entities } onclick={ select }>
            <div class="media-body">
                <strong>{ robot.name }</strong>
                <p>{ device.bluetoothDevice.name }</p>
            </div>
        </li>
    </ul>

    <script>
        var Manager = require('../Renderer').PanesManager;
        var Controller = require('../../../controller/Controller');
        var riot = require('riot');

        var self = this;
        this.entities = opts.entities;

        //When searching for an entity
        this.do_search = function(e){
            self.update({ entities: Controller.findDevicesByRegexp(new RegExp(this.search_input.value, "i")) });
        };

        //When selecting an entity
        this.select = function(e){
            //Removing active class
            Manager.setActive(e.currentTarget);
            //Setting the selected entity as mixin
            riot.mixin('entity_id', { id: this._item.id });
    
            //And update concerned tags
            document.dispatchEvent(new Event('entitySelected'));
        };

        //After adding an entity
        document.addEventListener("entities_update", function(e){
            self.update({ entities: Controller.getEntities() });
        });

    </script>

    <style>
        input:hover, textarea:hover{
            cursor: text;
        }

        input[type=radio]:hover, input[type=checkbox]:hover, select:hover, button:hover{
            cursor:pointer;
        }
    </style>

</search>