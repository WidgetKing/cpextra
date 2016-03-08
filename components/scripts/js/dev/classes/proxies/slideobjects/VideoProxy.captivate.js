/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 9/02/16
 * Time: 5:24 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("VideoProxy", ["BaseSlideObjectProxy"], function () {

    "use strict";

    function VideoProxy (element, data) {

        // Call super constructor
        _extra.classes.BaseSlideObjectProxy.call(this, element, data);

        var that = this;


        ///////////////////////////////////////////////////////////////////////
        /////////////// PRIVATE FUNCTIONS
        ///////////////////////////////////////////////////////////////////////
        this._endVideoListener = function() {
            that.dispatchEvent("videoended");
        };

        ///////////////////////////////////////////////////////////////////////
        /////////////// AFTER DRAW
        ///////////////////////////////////////////////////////////////////////
        this._getVideoTag = function () {

            that._videoTag = that._currentStateData.primaryObject.contentDIV.firstChild.firstChild;

            that._videoTag.addEventListener("ended", that._endVideoListener);

        };

        this._currentStateData.addOnDrawCallback(this._getVideoTag);


    }

    _extra.registerClass("VideoProxy", VideoProxy, "BaseSlideObjectProxy", _extra.CAPTIVATE);

    VideoProxy.prototype.unload = function() {

        this._videoTag.addEventListener("ended", this._endVideoListener);
        // Super!
        VideoProxy.superClass.unload.call(this);

    };

}, _extra.CAPTIVATE);