/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 31/10/16
 * Time: 4:25 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("WebObjectProxy", ["BaseSlideObjectProxy"], function () {

    "use strict";

    function WebObjectProxy(element, data) {

      this._isLoaded = false;

        // THIS MUST BE DONE BEFORE CALLING THE SUPER CONSTRUCTOR
        // Otherwise the border property below will run first without access to this.element
        if (_extra.captivate.useWidget7) {

            this.element = _extra.w.document.getElementById("re-" + data.name + "c");

        } else {

            this.element = element;

        }

        // Call super constructor
        _extra.classes.BaseSlideObjectProxy.call(this, element, data);

    }

    _extra.registerClass("WebObjectProxy", WebObjectProxy, "BaseSlideObjectProxy", _extra.CAPTIVATE);

    _extra.w.Object.defineProperty(WebObjectProxy.prototype, "interactive", {
        get: function () {
            return this._interactive;
        },
        set: function (value) {

            this._interactive = value;

            if (!this._currentStateData.primaryObject.upperDIV) {
                return;
            }

            if (value) {
                // Allow click events to go through the upper div and into the iframe
                this._currentStateData.primaryObject.upperDIV.style.pointerEvents = "none";
            } else {
                this._currentStateData.primaryObject.upperDIV.style.pointerEvents = "auto";
            }

        }
    });

    WebObjectProxy.prototype.onSlideObjectInitialized = function () {

        // Super!
        WebObjectProxy.superClass.onSlideObjectInitialized.call(this);

        this.iframe = _extra.w.document.getElementById("myFrame_" + this.name + "c");

        this.interactive = this.interactive;


        this.handleLoadedEvent();


        // Listen for document click (emitted from CpMate) Then reflect it to the document
        // This is mostly to allow the YAK pause menu to still appear when we tap the screen while
        // an animation is playing
        var that = this;

        ["click", "touchstart", "touchend"].forEach(function (event) {
            that.addEventListener(event, function (e) {

                document.dispatchEvent(e);

            });
        });










        /*

        var iframe = _extra.w.document.getElementById("myFrame_" + this.name + "c");

        iframe.addEventListener("load", function () {

            var iframeDocument = iframe.contentWindow.document;


            // iframe loaded
            _extra.log("iFrame loaded");
            _extra.log(iframeDocument.getElementsByTagName('video'));

        });

        */
    };


    WebObjectProxy.prototype.handleLoadedEvent = function () {

        var that = this;

        /**
         * The below code was written by StackOverflow user 'dude'
         * https://stackoverflow.com/questions/17158932/how-to-detect-when-an-iframe-has-already-been-loaded
         *
         * Will wait for an iframe to be ready
         * for DOM manipulation. Just listening for
         * the load event will only work if the iframe
         * is not already loaded. If so, it is necessary
         * to observe the readyState. The issue here is
         * that Chrome will initialize iframes with
         * "about:blank" and set its readyState to complete.
         * So it is furthermore necessary to check if it's
         * the readyState of the target document property.
         * Errors that may occur when trying to access the iframe
         * (Same-Origin-Policy) will be catched and the error
         * function will be called.
         * @param {jquery} $i - The jQuery iframe element
         * @param {function} successFn - The callback on success. Will
         * receive the jQuery contents of the iframe as a parameter
         * @param {function} errorFn - The callback on error
         */

        var onIframeReady = function($i, successFn, errorFn) {
            try {
                var iCon = $i.first()[0].contentWindow,
                    bl = "about:blank",
                    compl = "complete";
                var callCallback = function () {
                    try {
                        var $con = $i.contents();
                        if($con.length === 0) { // https://git.io/vV8yU
                            throw new _extra.w.Error("iframe inaccessible");
                        }
                        successFn($con);
                    } catch(e) { // accessing contents failed
                        errorFn();
                    }
                };
                var observeOnload = function () {
                    $i.on("load.jqueryMark", function () {
                        try {
                            var src = $i.attr("src").trim(),
                                href = iCon.location.href;
                            if(href !== bl || src === bl || src === "") {
                                $i.off("load.jqueryMark");
                                callCallback();
                            }
                        } catch(e) {
                            errorFn();
                        }
                    });
                };
                if(iCon.document.readyState === compl) {
                    var src = $i.attr("src").trim(),
                        href = iCon.location.href;
                    if(href === bl && src !== bl && src !== "") {
                        observeOnload();
                    } else {
                        callCallback();
                    }
                } else {
                    observeOnload();
                }
            } catch(e) { // accessing contentWindow failed
                errorFn();
            }
        };

        // End StackOverflow code


        onIframeReady(_extra.w.$(this.iframe),
            function () {

                that._isLoaded = true;

                that.dispatchEvent(_extra.eventManager.events.LOADED);

            },
            function () {

                that.dispatchEvent(_extra.eventManager.events.ERROR);
                _extra.debugging.debug("iframe " + that.name + " failed to load");

            });

    };


    WebObjectProxy.prototype.unload = function() {

        // Inform CpMate animations they need to unload
        _extra.cpMate.broadcastTo(this.name, {
            "action":"unload",
            "parameters":[]
        });

        this.iframe = null;
        this.element = null;

        // Super!
        WebObjectProxy.superClass.unload.call(this);

    };

    _extra.w.Object.defineProperty(WebObjectProxy.prototype,"isLoaded", {
        get: function() {
            return this._isLoaded;
        }
    });
}, _extra.CAPTIVATE);
