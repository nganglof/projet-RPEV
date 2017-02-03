var riot = require('riot');
var Controller = require('../app/controller/Controller');
var Renderer = require('../app/view/tags/Renderer').Renderer;
var ContextMenu = require('../app/view/js/ContextMenu');
var Manager = require('../app/view/tags/Renderer').PanesManager;
var BluetoothManager = require('../app/model/devices/BluetoothManager');

//register the root of the app
var path = require('path');
global.appRoot = path.resolve(__dirname);

//Load bluetoothDevices
BluetoothManager.importDevicesFrom(global.appRoot + '/view/resources/bluetooth/last_devices.json');

//Here we mount every single tag
riot.mount('toolbar', {active: "scene"});
riot.mount('menu', {active: "scene"});
riot.mount('bluetooth');
riot.mount('supervisor');
riot.mount('wfooter');

//Mounting scene
riot.mount('scene');
riot.mount('contextMenus');
riot.mount('selection', { entities: Controller.getEntities()});

//Mounting manager
riot.mount('manager');
riot.mount('search', { entities: Controller.getEntities() });
riot.mount('.management');


//And we add the main windows composing the app
Renderer.addWindow("manager");
Renderer.addWindow("scene");
Renderer.addWindow("bluetooth");
Renderer.addWindow("supervisor");
Renderer.hideAll();
Renderer.showWindow("scene");

Controller.setScene(document.getElementById('sceneCanvas'));

Manager.addPane("control");
Manager.addPane("edit");
Manager.addPane("add");
Manager.addPane("home");
Manager.setCurrentPane("home");


Controller.animateScene();

/*Controller.addSupervisor("simple", "SimpleSupervisor", 20);
Controller.setSupervisor("SimpleSupervisor");*/