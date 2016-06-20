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

        this.initializePrivateVariables(data);
        // Assigning the event mediator with the divs for the current state of the slide object
        this._eventMediator.swap(this._currentStateData);

        this.initializePublicMethods();

        this.initializeInternalMethods();

        this.initializeInitialState();

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

    ///////////////////////////////////////////////////////////////////////
    /////////////// INIT
    ///////////////////////////////////////////////////////////////////////

    BaseSlideObjectProxy.prototype.initializePrivateVariables = function (data) {

        // Private Variables that are public because we can't get around it

        this._data = data;
        this._model = _extra.slideObjects.model;
        this._currentStateData = data.getDataForState(this.state);
        this._offsetX = 0;
        this._offsetY = 0;
        this._modelListener = new _extra.classes.ModelListener(this.name, this._model);
        this._eventMediator = _extra.eventManager.getEventMediator(this.name);
        this._stateEndManager = new _extra.classes.SlideObjectEnterExitEventManager(this);
        this._stateEndManager.setCurrentDispatcher(this._currentStateData);
        this._interruptedClickEventHanlder = new _extra.classes.InterruptedClickEventHandler(this._eventMediator, this.name);
        this._originalX = this._currentStateData.originalX;
        this._originalY = this._currentStateData.originalY;

    };

    BaseSlideObjectProxy.prototype.initializePublicMethods = function () {
        var that = this;

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
    };

    BaseSlideObjectProxy.prototype.initializeInternalMethods = function () {

        var that = this;

        this._onStateChange = function(details) {

            var futureStateData = that.data.getDataForState(details.stateName);

            // Change the event listeners from the DOM elements of the previous state to the one of this state.
            that._eventMediator.swap(futureStateData);
            that._stateEndManager.setCurrentDispatcher(futureStateData);
            that._interruptedClickEventHanlder.stateHasChanged();

            // Update the offset
            that._offsetX = that._originalX - futureStateData.originalX;
            that._offsetY = that._originalY - futureStateData.originalY;

            // Complete the transition
            that._currentStateData = futureStateData;

            // Update to model
            that._modelListener.model.update(that.name);

        };
        _extra.slideObjects.states.changeCallback.addCallback(this.name, this._onStateChange);

        this._onAudioEnded = function () {
            that.dispatchEvent("audioended");
        };

        this._onAudioPaused = function (e) {

            // For your reference, the content fo the Captivate Audio Pause method
            /*
            pause: function() {
                        if (!this.paused && this.am.webAudio && this.am.pauseWebAudio(this.src)) this.paused = !0, this.am.verbose && a.log("webAudio:pause " + this.id + " " + this.src);
                        else if (this.isSeekPending() && (this.am.verbose && this.revoke && a.log("AdObjPause deleting revoke " + this.id), delete this.revoke), !this.paused) this.paused = !0, this.am.verbose && a.log("AdObjPause " + this.id + " " + this.src), this.nativeAudio && (this.nativeAudio.pause(), this.nativeAudio.pausedAt = (new Date).getTime())
                    },
             */

            // There is a possibility that the movie has paused the audio instead of letting it play all the way
            // to the end.
            // If the movie is paused, then Captivate usually lets the audio play all the way to the end
            // However, if the movie is playing, the audio is 'stopped' at a certain frame and the 'ended'
            // event is not fired.
            // So we'll fire it instead

            if (_extra.movieStatus.isPlaying()) {

                // Make sure we are still inside the timeline for the slide object
                if (_extra.movieStatus.currentFrame < that.data.endFrame &&
                    _extra.movieStatus.currentFrame >= that.data.startFrame) {

                    // Avoid the Promise Error in Google Chrome by waiting 150 milliseconds
                    _extra.w.setTimeout(function () {

                        // We want to make sure Captivate realizes that the audio has stopped.
                        // So we fiddle with the audio data.
                        // Stops Many Errors.
                        // Hopefully.
                        that._audioData.paused = true;
                        that.dispatchEvent("audioended");

                    }, 150);

                }

            }

        };
    };

    BaseSlideObjectProxy.prototype.initializeInitialState = function () {

        var that = this;

        // If all the visual elements of the slide object have been set up, then we can do things such as add listeners now,
        if (this._currentStateData.isInitialized) {
            this.onSlideObjectInitialized();
        // If not then we'll have to wait for the state to tell us when it's ready.
        } else {
            this._internalInitializationHandler = function () {
                that.onSlideObjectInitialized.call(that);
            };
            this._currentStateData.addEventListener("internalinitialization", that._internalInitializationHandler);
        }
    };





    ///////////////////////////////////////////////////////////////////////
    /////////////// Once the slide object has been completely loaded
    ///////////////////////////////////////////////////////////////////////

    BaseSlideObjectProxy.prototype.onSlideObjectInitialized = function () {

        // If we created an event handler to detect when the slide object had finished loading
        // Then we want to unload that listener now
        if (this._internalInitializationHandler) {
            this._currentStateData.removeEventListener("internalinitialization", this._internalInitializationHandler);
            delete this._internalInitializationHandler;
        }

        // At this point its possible the original X and Y positions have been updated.
        this._originalX = this._currentStateData.originalX;
        this._originalY = this._currentStateData.originalY;

        this._listenForAudioEvents();

        this._addModelListeners();

    };

    BaseSlideObjectProxy.prototype._listenForAudioEvents = function () {

        if (this._data.hasAudio) {

            this._audioData = _extra.captivate.audioManager.objectAudios[_extra.slideManager.currentInternalSlideId]
                                                                        [this._data.audioID];
            this._audioTag = this._audioData.nativeAudio;

            this._audioTag.addEventListener("ended", this._onAudioEnded);
            this._audioTag.addEventListener("pause", this._onAudioPaused);

        }
    };

    BaseSlideObjectProxy.prototype._addModelListeners = function () {

        var that = this;

        ////////////////////////////////
        ////////// Enable For Mouse
        this._modelListener.addProperty(ENABLE_FOR_MOUSE, function (previousValue, currentValue) {

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
        this._modelListener.addProperty(CURSOR, function (previousValue, currentValue) {

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


        this._modelListener.addProperty(X, function (previousValue, currentValue) {

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
        this._modelListener.addProperty(Y, function (previousValue, currentValue) {

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
        this._modelListener.addProperty(WIDTH, function (previousValue, currentValue) {

            that._currentStateData.width = currentValue;

        });


        ////////////////////////////////
        ////////// Height
        this._modelListener.addProperty(HEIGHT, function (previousValue, currentValue) {

            that._currentStateData.width = currentValue;

        });
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// OTHER
    ///////////////////////////////////////////////////////////////////////

    BaseSlideObjectProxy.prototype.changeState = function (stateName) {
        _extra.slideObjects.states.change(this.name, stateName);
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// UNLOAD
    ///////////////////////////////////////////////////////////////////////
    BaseSlideObjectProxy.prototype.unload = function () {

        this.dispatchEvent("unload");
        this._eventMediator.swap(null);
        this._stateEndManager.setCurrentDispatcher(null);
        this._modelListener.unload();
        this._interruptedClickEventHanlder.unload();
        if (this._internalInitializationHandler) {
            this._currentStateData.removeEventListener("internalinitialization", this._internalInitializationHandler);
        }
        _extra.slideObjects.states.changeCallback.removeCallback(this.name, this._onStateChange);

        if (this._data.hasAudio && this._audioTag) {
            this._audioTag.removeEventListener("ended", this._onAudioEnded);
            this._audioTag.removeEventListener("pause", this._onAudioPaused);
        }

        // Write States current location to Captivate data
        var stateData;
        for (var stateName in this._data.stateDatas) {
            if (this._data._stateDatas.hasOwnProperty(stateName)) {

                stateData = this._data.stateDatas[stateName];
                //stateData.x = this.x;
                //stateData.y = this.y;
                stateData.unload();

            }
        }

    };

    _extra.registerClass("BaseSlideObjectProxy", BaseSlideObjectProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);