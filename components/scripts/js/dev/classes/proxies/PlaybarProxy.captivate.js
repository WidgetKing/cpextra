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

        ///////////////////////////////////////////////////////////////////////
        /////////////// PRIVATE VARIABLES
        ///////////////////////////////////////////////////////////////////////
        var that = this,
            mainDIV = _extra.w.document.getElementById("playbar"),
            sliderDIV,
            sliderThumbDIV;

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

                if (that._scrubbing) {
                    _extra.cssManager.removeClassFrom(sliderDIV.parentNode, "extra-mouse-disabled");
                    _extra.cssManager.removeClassFrom(sliderDIV, "extra-mouse-disabled");
                    _extra.cssManager.removeClassFrom(sliderThumbDIV, "extra-mouse-disabled");
                } else {
                    _extra.cssManager.addClassTo(sliderDIV.parentNode, "extra-mouse-disabled");
                    _extra.cssManager.addClassTo(sliderDIV, "extra-mouse-disabled");
                    _extra.cssManager.addClassTo(sliderThumbDIV, "extra-mouse-disabled");
                }

            }


        };

        this.addEnterSlideCallback = function() {

            _extra.slideManager.enterSlideCallback.addCallback("*", getPlaybarElements);
            getPlaybarElements();

        };

        ///////////////////////////////////////////////////////////////////////
        /////////////// PRIVATE FUNCTIONS
        ///////////////////////////////////////////////////////////////////////



        function getPlaybarElements() {

            sliderDIV = _extra.w.document.getElementById("playbarSlider");
            sliderThumbDIV = _extra.w.document.getElementById("playbarSliderThumb");
            that.update();

        }


        ///////////////////////////////////////////////////////////////////////
        /////////////// LOGIC
        ///////////////////////////////////////////////////////////////////////
        // This will be initialized before we can add an enter slide callback. So we need to detect when that becomes
        // available.
        if (_extra.slideManager) {

            this.addEnterSlideCallback();

        } else {

            _extra.registerModule("PlaybarProxy_initialize", ["slideManager_global", "cssManager"], function () {
                _extra.captivate.playbar.addEnterSlideCallback();
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