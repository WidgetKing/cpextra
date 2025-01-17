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
        HEIGHT = "height",
        LOCK_FOCUS = "lockFocus";


    function BaseSlideObjectProxy(element, data) {

        this.initializePrivateVariables(element, data);
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
        get visibility() {
            return this._visibility;
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
        },

        get lockFocus() {
            return this._lockFocus;
        },
        set lockFocus(value) {

            // If we're just setting this to true again, we don't want to add multiple event listeners
            if (this._lockFocus !== value) {

                this._lockFocus = value;

                if (value) {
                    this._internalLockFocus();
                } else {
                    this._internalUnlockFocus();
                }

            }

        }
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// INIT
    ///////////////////////////////////////////////////////////////////////

    BaseSlideObjectProxy.prototype.initializePrivateVariables = function (element, data) {

        // Private Variables that are public because we can't get around it
        this._data = data;
        this._focusDiv = _extra.w.document.body;//element;
        this._model = _extra.slideObjects.model;
        this._currentStateData = data.getDataForState(this.state);
        this._offsetX = 0;
        this._offsetY = 0;
        this._lockFocus = false;
        this._modelListener = new _extra.classes.ModelListener(this.name, this._model);
        this._eventMediator = _extra.eventManager.getEventMediator(this.name);
        this._stateEndManager = new _extra.classes.SlideObjectEnterExitEventManager(this);
        this._stateEndManager.setCurrentDispatcher(this._currentStateData);
        this._interruptedClickEventHandler = new _extra.classes.InterruptedClickEventHandler(this._eventMediator, this.name);
        this._originalX = this._currentStateData.originalX;
        this._originalY = this._currentStateData.originalY;
        this._visibility = new _extra.classes.SlideObjectVisibilityManager(this, this._currentStateData);

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
            that._visibility.updateStateData(futureStateData);
            that._stateEndManager.setCurrentDispatcher(futureStateData);
            //that._interruptedClickEventHandler.stateHasChanged();

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

        this._onAudioPaused = function () {

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
                if (_extra.movieStatus.isCurrentFrameWithinRange(that.data.startFrame, that.data.endFrame)) {

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

        this._internalLockFocus = function () {
            // Only lock focus if everything is already loaded.
            var $div,
                that = this;

            if (this._currentStateData.isInitialized) {

                $div = _extra.$(this._focusDiv);

                if ($div.hasOwnProperty("on")) {
                    $div.on('keydown', this._focusHandler).focus();

                // if using older version of jQuery
                } else {
                    $div.bind('keydown', that._focusHandler).focus();
                }

            }

        };

        this._focusHandler = function (e) {

            if (e.keyCode === 9) {
                e.preventDefault();
                _extra.$(that._focusDiv).focus();
            }

        };

        this._internalUnlockFocus = function () {
            var $div = _extra.$(this._focusDiv);
            if ($div.hasOwnProperty("off")) {

                $div.off('keydown', this._focusHandler);

            } else {

                $div.unbind('keydown', this._focusHandler);

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

            this._currentStateData.addEventListener("internalinitialization", this._internalInitializationHandler);
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

        if (this.lockFocus) {
            this._internalLockFocus();
        }

        // At this point its possible the original X and Y positions have been updated.
        this._originalX = this._currentStateData.originalX;
        this._originalY = this._currentStateData.originalY;

        this._listenForAudioEvents();

        this._addModelListeners();

    };

    BaseSlideObjectProxy.prototype._listenForAudioEvents = function () {

        if (this._data.hasAudio) {

            var that = this,
                callback = function (audioData) {

                    _extra.audioManager.audioDataCallback.removeCallback(that._data.audioID, callback);

                    that._audioData = audioData;
                    that._audioTag = that._audioData.nativeAudio;
                    that._audioTag.addEventListener("ended", that._onAudioEnded);
                    that._audioTag.addEventListener("pause", that._onAudioPaused);

                };

            _extra.audioManager.audioDataCallback.addCallback(this._data.audioID, callback);

            /*this._audioTag = this._audioData.nativeAudio;

            if (this._audioTag) {

                this._audioTag.addEventListener("ended", this._onAudioEnded);
                this._audioTag.addEventListener("pause", this._onAudioPaused);

            } else {
                _extra.log("ERROR: Could not find the audio tag for '" + this.name + "'");

                _extra.log(_extra.captivate.audioManager.allocAudioChannel);

            }*/

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
                    that._currentStateData.editCSS("pointer-events", "auto");
                    // We used to accomplish this with adding and removing classes
                    // but for some reason in responsive output when assigning this to
                    // an object set to display for rest of project it caused a crash.
                    //that._currentStateData.removeClass("extra-mouse-disabled");

                } else {

                    // DISABLE
                    that._currentStateData.editCSS("pointer-events", "none");
                    //that._currentStateData.addClass("extra-mouse-disabled");

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

        ////////////////////////////////
        ////////// Lock Focus
        this._modelListener.addProperty(LOCK_FOCUS, function (previousValue, currentValue) {

            that.lockFocus = currentValue;

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
        this._visibility = null;
        this.lockFocus = false;
        this._interruptedClickEventHandler.unload();
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

        // If we do not clear now, the next slide will fail to generate new state datas.
        // Which means the upperDIV will be from the previous slide, not from the current version of the slide.
        this._data.clearStateDatas();

    };

    _extra.registerClass("BaseSlideObjectProxy", BaseSlideObjectProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);
