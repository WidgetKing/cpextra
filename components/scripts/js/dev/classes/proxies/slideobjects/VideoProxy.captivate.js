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

        /*
        ///////////////////////////////////////////////////////////////////////
        /////////////// AFTER DRAW
        ///////////////////////////////////////////////////////////////////////
        this._getVideoTag = function () {

            _extra.log("GETTING TAG!");
            that._currentStateData.addEventListener("internalinitialization", that._getVideoTag);

            that._videoTag = that._currentStateData.primaryObject.contentDIV.firstChild.firstChild;

            that._videoTag.addEventListener("ended", that._endVideoListener);

        };

        if (this._currentStateData.isInitialized) {
            this._getVideoTag();
        } else {
            this._currentStateData.addEventListener("internalinitialization", this._getVideoTag);
        }
        //this._currentStateData.addOnDrawCallback(this._getVideoTag);*/



    }

    _extra.registerClass("VideoProxy", VideoProxy, "BaseSlideObjectProxy", _extra.CAPTIVATE);

    VideoProxy.prototype.onSlideObjectInitialized = function () {

        // Super!
        VideoProxy.superClass.onSlideObjectInitialized.call(this);

        this._currentStateData.addEventListener("internalinitialization", this._getVideoTag);

        this._videoTag = this._currentStateData.primaryObject.contentDIV.firstChild.firstChild;

        this._videoTag.addEventListener("ended", this._endVideoListener);

    };

    VideoProxy.prototype.unload = function() {

        if (this._videoTag) {
            this._videoTag.addEventListener("ended", this._endVideoListener);
        }
        // Super!
        VideoProxy.superClass.unload.call(this);

    };

}, _extra.CAPTIVATE);