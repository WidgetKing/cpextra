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
        this._modelListener = new _extra.classes.ModelListener(this.name, this._model);
        this._eventMediator = _extra.eventManager.getEventMediator(this.name);
        this._interruptedClickEventHanlder = new _extra.classes.InterruptedClickEventHandler(this._eventMediator, this.name);

        ///////////////////////////////////////////////////////////////////////
        /////////////// Private Variables
        ///////////////////////////////////////////////////////////////////////
        var that = this,
            originalX = this._currentStateData.originalX,
            originalY = this._currentStateData.originalY;

        this._eventMediator.swap(this._currentStateData);


        ///////////////////////////////////////////////////////////////////////
        /////////////// Public Methods
        ///////////////////////////////////////////////////////////////////////
        this.addEventListener = function (eventName, callback) {
            that._eventMediator.addEventListener(eventName, callback);
        };

        this.removeEventListener = function (eventName, callback) {
            that._eventMediator.removeEventListener(eventName, callback);
        };

        this.hasEventListener = function(eventName) {
            return that._eventMediator.hasEventListener(eventName);
        };

        this.dispatchEvent = function(event) {
            that._eventMediator.dispatchEvent(event);
        };

        this.enableForMouse = function() {
            that._modelListener.model.write(this.name, ENABLE_FOR_MOUSE, true);
        };

        this.disableForMouse = function() {
            that._modelListener.model.write(this.name, ENABLE_FOR_MOUSE, false);
        };

        this.setHandCursor = function(cursorType) {
            that._modelListener.model.write(this.name, CURSOR, cursorType);
        };


        ///////////////////////////////////////////////////////////////////////
        /////////////// Internal Methods
        ///////////////////////////////////////////////////////////////////////
        ////////////////////////////////
        ////////// Manage State Changing

        this._onStateChange = function(details) {

            var futureStateData = data.getDataForState(details.stateName);

            // Change the event listeners from the DOM elements of the previous state to the one of this state.
            that._eventMediator.swap(futureStateData);
            that._interruptedClickEventHanlder.stateHasChanged();

            // Update the offset
            that._offsetX = originalX - futureStateData.originalX;
            that._offsetY = originalY - futureStateData.originalY;

            // Complete the transition
            that._currentStateData = futureStateData;

            // Update to model
            that._modelListener.model.update(that.name);

        };
        _extra.slideObjects.states.changeCallback.addCallback(this.name, this._onStateChange);

        this._onAudioEnded = function () {
            that.dispatchEvent("audioended");
        };

        ///////////////////////////////////////////////////////////////////////
        /////////////// MODEL LISTENER METHODS
        ///////////////////////////////////////////////////////////////////////

        this._addModelListeners = function () {

            // At this point its possible the original X and Y positions have been updated.
            originalX = that._currentStateData.originalX;
            originalY = that._currentStateData.originalY;

            that._currentStateData.removeOnDrawCallback(that._addModelListeners);

             ////////////////////////////////
             ////////// Audio
             if (that._data.hasAudio) {

                 that._audioData = _extra.captivate.audioManager.objectAudios[_extra.slideManager.currentInternalSlideId][that._data.audioID];
                 that._audioTag = that._audioData.nativeAudio;
                 that._audioTag.addEventListener("ended", that._onAudioEnded);
             }

            ////////////////////////////////
            ////////// Enable For Mouse
            that._modelListener.addProperty(ENABLE_FOR_MOUSE, function (previousValue, currentValue) {

                /*
                 * Abandoned the idea of using DIV elements to block mouse events in Internet Explorer.
                 * But just incase you needed that css again, it looked like this:
                 *
                 * background-color:#F00;
                 * width: 100px;
                 * height: 100px;
                 * border: 3px solid #73AD21;
                 * position:absolute;
                 * top:100px;
                 * left:100px;
                 *
                 */

                /*if (_extra.isIE) {

                    if (currentValue) {



                    } else {

                        var resistor = new _extra.classes.MouseEventByPasser(that);

                    }

                } else {*/

                    if (currentValue) {

                        // ENABLE
                        that._currentStateData.removeClass("extra-mouse-disabled");

                    } else {

                        // DISABLE
                        that._currentStateData.addClass("extra-mouse-disabled");

                    }

                //}


            });

            ////////////////////////////////
            ////////// Hand Cursor
            that._modelListener.addProperty(CURSOR, function (previousValue, currentValue) {

                that._currentStateData.editCSS("cursor", currentValue);

            });

            ////////////////////////////////
            ////////// X
            function isDefault(currentValue) {

                if (currentValue.toLowerCase) {

                    currentValue = currentValue.toLowerCase();
                    return currentValue === "default" || currentValue === "reset" || currentValue === "original";

                }

                return false;

            }


            that._modelListener.addProperty(X, function (previousValue, currentValue) {


                if (isDefault(currentValue)) {
                    currentValue = (that._currentStateData.originalX) + that._offsetX;
                }

                // Convert string to number
                if (typeof currentValue !== "number") {

                    currentValue = _extra.w.parseFloat(currentValue);

                }

                that._currentStateData.x = currentValue - that._offsetX;


            });

            ////////////////////////////////
            ////////// Y
            that._modelListener.addProperty(Y, function (previousValue, currentValue) {

                if (isDefault(currentValue)) {
                    currentValue = (that._currentStateData.originalY) + that._offsetY;
                }

                // Convert String to number
                if (typeof currentValue !== "number") {

                    currentValue = _extra.w.parseFloat(currentValue);

                }

                that._currentStateData.y = currentValue - that._offsetY;

            });

            ////////////////////////////////
            ////////// Width
            that._modelListener.addProperty(WIDTH, function (previousValue, currentValue) {

                that._currentStateData.width = currentValue;

            });


            ////////////////////////////////
            ////////// Height
            that._modelListener.addProperty(HEIGHT, function (previousValue, currentValue) {

                that._currentStateData.width = currentValue;

            });

        };

        this._currentStateData.addOnDrawCallback(that._addModelListeners);


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

    BaseSlideObjectProxy.prototype.unload = function () {

        this.dispatchEvent("unload");
        this._eventMediator.swap(null);
        this._modelListener.unload();
        this._interruptedClickEventHanlder.unload();
        _extra.eventManager.eventDispatcher.removeEventListener("slideloaded", this._addModelListeners);
        _extra.slideObjects.states.changeCallback.removeCallback(this.name, this._onStateChange);
        this._currentStateData.removeOnDrawCallback(this._addModelListeners);

        if (this._data.hasAudio && this._audioTag) {
            this._audioTag.removeEventListener("ended", this._onAudioEnded);
        }
    };

    _extra.registerClass("BaseSlideObjectProxy", BaseSlideObjectProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);