/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 7:07 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("BaseSlideObjectProxy", function () {

    "use strict";

    var ENABLE_FOR_MOUSE = "enableForMouse";

    function BaseSlideObjectProxy(element, data) {

        ///////////////////////////////////////////////////////////////////////
        /////////////// Private Variables that are public because we can't get around it
        ///////////////////////////////////////////////////////////////////////
        this._data = data;

        ///////////////////////////////////////////////////////////////////////
        /////////////// Private Variables
        ///////////////////////////////////////////////////////////////////////
        var listeners = new _extra.classes.Callback(),
            currentStateData = data.getDataForState(this.state),
            modelListener = new _extra.classes.ModelListener(this.name, _extra.slideObjects.model);

        ///////////////////////////////////////////////////////////////////////
        /////////////// Public Methods
        ///////////////////////////////////////////////////////////////////////
        this.addEventListener = function (eventName, callback) {
            listeners.addCallback(eventName, callback);
            currentStateData.addEventListener(eventName, callback);
        };

        this.removeEventListener = function (eventName, callback) {
            listeners.removeCallback(eventName, callback);
            currentStateData.removeEventListener(eventName, callback);
        };

        this.hasEventListener = function(eventName) {
            return listeners.hasCallbackFor(eventName);
        };

        this.enableForMouse = function() {
            listeners.model.write(this.name, ENABLE_FOR_MOUSE, true);
        };

        this.disableForMouse = function() {
            listeners.model.write(this.name, ENABLE_FOR_MOUSE, false);
        };

        this.unload = function () {
            listeners.forEach(function (index, callback) {
                currentStateData.removeEventListener(index,callback);
            });
            modelListener.unload();
        };

        ///////////////////////////////////////////////////////////////////////
        /////////////// Internal Methods
        ///////////////////////////////////////////////////////////////////////
        ////////////////////////////////
        ////////// Manage State Changing
        _extra.slideObjects.states.changeCallback.addCallback(this.name, function (details) {

            var futureStateData = data.getDataForState(details.stateName);

            listeners.forEach(function (index, callback) {
                currentStateData.removeEventListener(index,callback);
                futureStateData.addEventListener(index,callback);
            });

            // Complete the transition
            currentStateData = futureStateData;
        });

        ////////////////////////////////
        ////////// Model Listener Methods
        modelListener.addProperty(ENABLE_FOR_MOUSE, function (previousValue, currentValue) {

            if (currentValue) {

                // ENABLE
                currentStateData.addClass("disabledForMouse", ".disabledForMouse { pointer-events:none; }");

            } else {

                // DISABLE
                currentStateData.removeClass("disabledForMouse");

            }

        }, true);

    }

    BaseSlideObjectProxy.prototype = {
        get name(){
            return this._data.name;
        },
        get data() {
            return this._data;
        },
        get type(){
            return this._data.type;
        },
        get state() {
            return this._data.currentStateName;
        }
    };

    BaseSlideObjectProxy.prototype.changeState = function (stateName) {
        _extra.slideObjects.states.change(this.name, stateName);
    };

    _extra.registerClass("BaseSlideObjectProxy", BaseSlideObjectProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);