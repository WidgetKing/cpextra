/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 7:07 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("BaseSlideObjectProxy", function () {

    "use strict";

    var ENABLE_FOR_MOUSE = "enableForMouse",
        CURSOR = "cursor",
        X = "x", Y = "y",
        WIDTH = "width",
        HEIGHT = "height";


    function BaseSlideObjectProxy(element, data) {



        ///////////////////////////////////////////////////////////////////////
        /////////////// Private Variables that are public because we can't get around it
        ///////////////////////////////////////////////////////////////////////
        this._data = data;
        this._model = _extra.slideObjects.model;
        this._currentStateData = data.getDataForState(this.state);
        this._offsetX = 0;
        this._offsetY = 0;



        ///////////////////////////////////////////////////////////////////////
        /////////////// Private Variables
        ///////////////////////////////////////////////////////////////////////
        var listeners = new _extra.classes.Callback(),
            modelListener = new _extra.classes.ModelListener(this.name, this._model),
            that = this,
            originalX = this._currentStateData.originalX,
            originalY = this._currentStateData.originalY;

        ///////////////////////////////////////////////////////////////////////
        /////////////// Public Methods
        ///////////////////////////////////////////////////////////////////////
        this.addEventListener = function (eventName, callback) {
            listeners.addCallback(eventName, callback);
            this._currentStateData.addEventListener(eventName, callback);
        };

        this.removeEventListener = function (eventName, callback) {
            listeners.removeCallback(eventName, callback);
            this._currentStateData.removeEventListener(eventName, callback);
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

        this.setHandCursor = function(cursorType) {
            listeners.model.write(this.name, CURSOR, cursorType);
        };

        this.unload = function () {
            listeners.forEach(function (index, callback) {
                that._currentStateData.removeEventListener(index,callback);
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
                that._currentStateData.removeEventListener(index,callback);
                futureStateData.addEventListener(index,callback);
            });

            // Update the offset
            that._offsetX = originalX - futureStateData.originalX;
            that._offsetY = originalY - futureStateData.originalY;

            // Complete the transition
            that._currentStateData = futureStateData;

            // Update to model
            modelListener.model.update(that.name);

        });



        ///////////////////////////////////////////////////////////////////////
        /////////////// MODEL LISTENER METHODS
        ///////////////////////////////////////////////////////////////////////

        ////////////////////////////////
        ////////// Enable For Mouse
        modelListener.addProperty(ENABLE_FOR_MOUSE, function (previousValue, currentValue) {

            if (currentValue) {

                // ENABLE
                that._currentStateData.removeClass("extra-mouse-disabled");

            } else {

                // DISABLE
                that._currentStateData.addClass("extra-mouse-disabled");

            }

        });

        ////////////////////////////////
        ////////// Hand Cursor
        modelListener.addProperty(CURSOR, function (previousValue, currentValue) {

            that._currentStateData.editCSS("cursor", currentValue);

        });

        ////////////////////////////////
        ////////// X
        modelListener.addProperty(X, function (previousValue, currentValue) {

            that._currentStateData.x = currentValue - that._offsetX;

        });

        ////////////////////////////////
        ////////// Y
        modelListener.addProperty(Y, function (previousValue, currentValue) {

            that._currentStateData.y = currentValue - that._offsetY;

        });

        ////////////////////////////////
        ////////// Width
        modelListener.addProperty(WIDTH, function (previousValue, currentValue) {

            that._currentStateData.width = currentValue;

        });


        ////////////////////////////////
        ////////// Height
        modelListener.addProperty(HEIGHT, function (previousValue, currentValue) {

            that._currentStateData.width = currentValue;

        });

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
        },

        get x() {
            return this._currentStateData.x + this._offsetX;
        },
        set x(value) {
            this._model.write(this.name, X, value);
        },
        get y() {
            return this._currentStateData.y + this._offsetY;
        },
        set y(value) {
            this._model.write(this.name, Y, value);
        },

        get width() {
            return this._currentStateData.width;
        },
        get height() {
            return this._currentStateData.height;
        }


    };

    BaseSlideObjectProxy.prototype.changeState = function (stateName) {
        _extra.slideObjects.states.change(this.name, stateName);
    };

    _extra.registerClass("BaseSlideObjectProxy", BaseSlideObjectProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);