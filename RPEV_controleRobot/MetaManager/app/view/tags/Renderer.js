"use strict";

var riot = module.parent.require('riot');
var Controller = require('../../controller/Controller');

//Misc
require('./nav/toolbar.tag');
require('./nav/menu.tag');
require('./misc/wfooter.tag');

//Scene
require('./scene/scene.tag');
require('./scene/selection.tag');
require('./misc/contextMenus.tag');

//Manager
require('./manager/manager.tag');
require('./manager/home.tag');
require('./manager/search.tag');
require('./manager/add.tag');
require('./manager/edit.tag');
require('./manager/control.tag');

//Bluetooth
require('./bluetooth/bluetooth.tag');

//Supervisor
require('./supervisor/supervisor.tag');

//Windows are a map of windows composing the app
var windows = new Map();
var currentWindow;

var exports = module.exports = {};

class Renderer {

    static hideAll(){
        for(let window of windows.values()){
            window.style.display = 'none';
        }
    }

    static addWindow(windowName, element){
        windows.set(windowName, document.getElementsByTagName(windowName || element)[0]);
    }

    static currentWindow(){
        return currentWindow;
    }

    static currentContainsCanvas(){
        return currentWindow === 'scene';
    }
    
    static showWindow(windowName){
        //Hides every window

        if(currentWindow)
            windows.get(currentWindow).style.display = 'none';

        //shows only the concerned
        windows.get(windowName).style.display = '';
        currentWindow = windowName;
        document.dispatchEvent(new Event("windowChanged"));
    }
}
exports.Renderer = Renderer;

var panes = new Map();
var currentPane;

function addClassAndRemoveAnother(elementName, added, removed){
    var pane = panes.get(elementName);
    pane.classList.remove(removed);
    pane.classList.add(added);
}

class PanesManager{
    static addPane(pane, element){
        panes.set(pane, document.getElementsByTagName(pane || element)[0]);
    }

    static getCurrentPane(){
        return currentPane;
    }

    static setCurrentPane(paneName){
        currentPane = paneName;
        PanesManager.changePane(paneName);
    }

    static changePane(paneName){
        addClassAndRemoveAnother(currentPane, 'before-shade');

        for(var key of panes.keys()){
            panes.get(key).style.display = 'none';
        }

        //shows only the concerned
        panes.get(paneName).style.display = '';
        addClassAndRemoveAnother(paneName, 'shade-in-right', 'before-shade');
        currentPane = paneName;
    }

    static setActive(element){
        var items = document.getElementsByClassName('entities-list');
        for(let i=0;i<items.length;i++){
            items[i].classList.remove("active");
        }

        if(element)
            element.classList.add("active");
    }
}

exports.PanesManager = PanesManager;