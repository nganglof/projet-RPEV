"use strict";

var Controller = require('../../controller/Controller');

var panes = new Map();
var currentPane;

function addClassAndRemoveAnother(elementName, added, removed){
    var pane = panes.get(elementName);
    pane.classList.remove(removed);
    pane.classList.add(added);
}

class Creation{
    static addPane(pane, paneName){
        panes.set(paneName, pane);
    }

    static getCurrentPane(){
        return currentPane;
    }

    static setCurrentPane(paneName){
        currentPane = paneName;
        Creation.changePane(paneName);
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

    static searchByNameOrAddress(value){
        return Controller.findDevicesByRegexp(new RegExp(value, "i"));
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
module.exports = Creation;