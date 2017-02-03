"use strict";

var contextMenuLinkClassName = "cm__link";
var contextMenuActive = "cm--active";

/**
 *
 */
class ContextMenu {

    /**
     *
     * @param targetId
     * @param menu
     */
    constructor(targetId, menu, funcAction) {
        this.targetId = targetId;
        this.menu = menu;
        this.menuState = 0;
        this.funcAction = funcAction;
    }

    /**
     *
     */
    setUp(){
        this.setContextListener();
        this.setClickListener();
        this.setKeyUpListener();
        this.setResizeListener();
    }

    /**
     * Function to check if we clicked inside an element with a particular class
     * name.
     *
     * @param {Object} e The event
     * @param targetId
     * @return {Boolean}
     */
    clickInsideElement(e, targetId = this.targetId) {
        var el = e.srcElement || e.target;

        if (el.id === targetId || el.classList.contains(targetId)) {
            return el;
        } else {
            while (el = el.parentNode) {
                if ((el.id && el.id === targetId) || (el.classList && el.classList.contains(targetId))) {
                    return el;
                }
            }
        }
        return false;
    }

    /**
     * Get's exact position of event.
     *
     * @param {Object} e The event passed in
     * @return {Object} Returns the x and y position
     */
    static getPosition(e) {
        var posx = 0;
        var posy = 0;

        if (!e) var e = window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return {
            x: posx,
            y: posy
        }
    }

    /**
     * Listens for contextmenu events.
     */
    setContextListener() {
        var self = this;
        document.getElementById(this.targetId).oncontextmenu = function (e) {
            if (self.clickInsideElement(e)) {
                e.preventDefault();
                self.toggleMenuOn();
                ContextMenu.positionMenu(e, self.menu);
            } else {
                self.toggleMenuOff();
            }
        };
    }

    /**
     * Listens for click events.
     */
    setClickListener() {
        var self = this;
        document.addEventListener("click", function (e) {
            var elem = self.clickInsideElement(e, contextMenuLinkClassName);

            if (elem) {
                e.preventDefault();
                self.funcAction(elem);
                self.toggleMenuOff();
            } else {
                var button = e.which || e.button;
                if (button === 1) {
                    self.toggleMenuOff();
                }
            }
        });
    }

    /**
     * Listens for keyup events.
     */
    setKeyUpListener() {
        var self=this;

        window.onkeyup = function (e) {
            //escape
            if (e.keyCode === 27) {
                self.toggleMenuOff();
            }
        }
    }

    /**
     * Window resize event listener
     */
    setResizeListener() {
        var self=this;

        window.onresize = function (e) {
            self.toggleMenuOff();
        };
    }

    /**
     * Turns the custom context menu on.
     */
    toggleMenuOn() {
        if (this.menuState !== 1) {
            this.menuState = 1;
            this.menu.classList.add(contextMenuActive);
        }
    }

    /**
     * Turns the custom context menu off.
     */
    toggleMenuOff() {
        if (this.menuState !== 0) {
            this.menuState = 0;
            this.menu.classList.remove(contextMenuActive);
        }
    }

    /**
     * Positions the menu properly.
     *
     * @param {Object} e The event
     * @param menu
     */
    static positionMenu(e, menu) {
        var clickCoords = ContextMenu.getPosition(e);

        var menuWidth = menu.offsetWidth + 4;
        var menuHeight = menu.offsetHeight + 4;

        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;

        if ((windowWidth - clickCoords.x) < menuWidth) {
            menu.style.left = windowWidth - menuWidth + "px";
        } else {
            menu.style.left = clickCoords.x + "px";
        }

        if ((windowHeight - clickCoords.y) < menuHeight) {
            menu.style.top = windowHeight - menuHeight + "px";
        } else {
            menu.style.top = clickCoords.y + "px";
        }
    }

}
module.exports = ContextMenu;