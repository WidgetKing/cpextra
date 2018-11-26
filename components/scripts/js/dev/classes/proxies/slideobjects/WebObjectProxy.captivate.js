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

        // Call super constructor
        _extra.classes.BaseSlideObjectProxy.call(this, element, data);

        if (_extra.captivate.useWidget7) {

            this.element = _extra.w.document.getElementById("re-" + this.name + "c");

        } else {

            this.element = element;

        }


    }

    _extra.registerClass("WebObjectProxy", WebObjectProxy, "BaseSlideObjectProxy", _extra.CAPTIVATE);

    _extra.w.Object.defineProperty(WebObjectProxy.prototype, "border", {
        get: function () {
            return this._border;
        },
        set: function (value) {

            try {
            this._border = value;

            if (value) {
                this.element.style.border = "0px";
                this.element.style.overflow = "hidden";
            } else {
                this.element.style.border = "1px";
            }
            } catch (e) {
                console.log(this.element);
            }

        }
    });

    WebObjectProxy.prototype.onSlideObjectInitialized = function () {

        // Super!
        WebObjectProxy.superClass.onSlideObjectInitialized.call(this);

        this.iframe = _extra.w.document.getElementById("myFrame_" + this.name + "c");

        // Only now will the border style be set in stone, so we need to hide it now.
        this.border = this.border;

        // Allow click events to go through the upper div and into the iframe
        this._currentStateData.primaryObject.upperDIV.style.pointerEvents = "none";

        this.handleLoadedEvent();











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

}, _extra.CAPTIVATE);