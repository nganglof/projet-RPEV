<selection class="pane pane-sm sidebar">
    <ul class="list-group">
        <li class="list-group-header">
            <input name="search_input" class="form-control" type="search" placeholder="Search for an entity" oninput={ do_search }>
        </li>
        <li class="list-group-item entities-list" each={ entities }>
            <div class="media-body">
                <strong>{ robot.name } <span class="indicator media-object icon icon-record" style="color:{ robot.sceneElement.color };"></span></strong>
                <div class="pull-right">
                    <input type="checkbox" onchange={ select }>
                </div>
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

            var selected = riot.mixin('selected_entities').selected;

            if(e.currentTarget.checked === true){
                selected.push(this._item);
            }else{
                selected.splice(selected.indexOf(this._item), 1);
            }
        };

        //After adding an entity
        document.addEventListener("entities_update", function(e){
            self.update({ entities: Controller.getEntities() });
        });

    </script>

    <style>
        .indicator{
            margin-left:10px;
        }
    </style>
</selection>