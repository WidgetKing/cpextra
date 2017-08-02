/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/11/15
 * Time: 10:19 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("PlaybarProxy", function () {

    "use strict";

    function PlaybarProxy() {

        function dummy() {

        }

        ///////////////////////////////////////////////////////////////////////
        /////////////// PRIVATE VARIABLES
        ///////////////////////////////////////////////////////////////////////
        var that = this,
            mainDIV = _extra.w.document.getElementById("playbar"),
            sliderDIV,
            sliderThumbDIV,
            hasSlider;

        ///////////////////////////////////////////////////////////////////////
        /////////////// PUBLIC VARIABLES
        ///////////////////////////////////////////////////////////////////////
        this._scrubbing = true;

        ///////////////////////////////////////////////////////////////////////
        /////////////// PUBLIC FUNCTIONS
        ///////////////////////////////////////////////////////////////////////

        this.update = function () {

            // If we've already loaded everything
            if (_extra.slideManager && _extra.cssManager) {


                if (hasSlider) {

                    that.managerPlaybarScrubbing();

                }


            }


        };

        this.managerPlaybarScrubbing = function () {

            // TODO: IE Fix, but has bug where you can drag on the playbar and it recognizes the mouse up.
            /*var playbarPrototype = _extra.captivate.playbarClass.prototype;



            if (that._scrubbing) {

                _extra.removeHook(playbarPrototype, "moveSlider", dummy);
                _extra.removeHook(playbarPrototype, "onMouseDown", dummy);
                // Hand cursor.
                _extra.cssManager.removeClassFrom(sliderThumbDIV, "extra-mouse-disabled");
                _extra.log("Removing Hook");

            } else {

                _extra.addHookBefore(playbarPrototype, "moveSlider", dummy);
                _extra.addHookBefore(playbarPrototype, "onMouseDown", dummy);
                _extra.cssManager.addClassTo(sliderThumbDIV, "extra-mouse-disabled");
                _extra.log("Adding Hook");

            }*/

            if (that._scrubbing) {
                _extra.cssManager.removeClassFrom(sliderDIV.parentNode, "extra-mouse-disabled");
                _extra.cssManager.removeClassFrom(sliderDIV, "extra-mouse-disabled");
                _extra.cssManager.removeClassFrom(sliderThumbDIV, "extra-mouse-disabled");
            } else {
                _extra.cssManager.addClassTo(sliderDIV.parentNode, "extra-mouse-disabled");
                _extra.cssManager.addClassTo(sliderDIV, "extra-mouse-disabled");
                _extra.cssManager.addClassTo(sliderThumbDIV, "extra-mouse-disabled");
            }

        };

        this.init = function() {

            // These objects change on every slide, so we have to repeatedly grab these objects.
            _extra.slideManager.enterSlideCallback.addCallback("*", getPlaybarElements);

            // When the window resizes, the playbar css is reset, which means xprefDisablePlaybarScrubbing may not work
            // correctly. We'll update this.
            // Also, every time you resize, Captivate creates a new playbar div. What's up with that?
            _extra.w.addEventListener("resize", getPlaybarElements);

            getPlaybarElements();

        };

        ///////////////////////////////////////////////////////////////////////
        /////////////// PRIVATE FUNCTIONS
        ///////////////////////////////////////////////////////////////////////



        function getPlaybarElements() {


            sliderDIV = _extra.w.document.getElementById("playbarSlider");
            hasSlider = sliderDIV !== null;
            sliderThumbDIV = _extra.w.document.getElementById("playbarSliderThumb");
            that.update();


        }


        ///////////////////////////////////////////////////////////////////////
        /////////////// LOGIC
        ///////////////////////////////////////////////////////////////////////
        // This will be initialized before we can add an enter slide callback. So we need to detect when that becomes
        // available.
        if (_extra.slideManager) {

            this.init();

        } else {

            _extra.registerModule("PlaybarProxy_initialize", ["slideManager_global", "cssManager"], function () {
                _extra.captivate.playbar.init();
            });

        }

    }

    PlaybarProxy.prototype = {
        set scrubbing(value){
            this._scrubbing = value;
            this.update();
        },
        get scrubbing() {
            return this._scrubbing;
        }
    };

    _extra.registerClass("PlaybarProxy", PlaybarProxy);

}, _extra.CAPTIVATE);