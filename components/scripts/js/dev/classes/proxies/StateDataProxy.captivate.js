/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/10/15
 * Time: 10:59 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("StateDataProxy",function () {

    "use strict";


    ///////////////////////////////////////////////////////////////////////
    /////////////// PRIVATE STATIC FUNCTIONS
    ///////////////////////////////////////////////////////////////////////
    function removePXSuffix(value) {
        if (value.substr(value.length - 2, 2) === "px") {
            value = value.substr(0,value.length - 2);
        }

        return parseFloat(value);
    }

    function doCSSPropertySet(value, offsetProperty, cssProperty, that) {

        var offset = that.primaryObject[offsetProperty];

        that.slideObjects.forEach(function (data) {

            var valueForSlideObject = value;
            valueForSlideObject -= offset - data[offsetProperty];
            valueForSlideObject = valueForSlideObject + "px";

            _extra.cssManager.editCSSOn(data.upperDIV, cssProperty, valueForSlideObject);
            _extra.cssManager.editCSSOn(data.contentDIV, cssProperty, valueForSlideObject);
        });

    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// CONSTRUCTOR
    ///////////////////////////////////////////////////////////////////////

    function StateDataProxy(data) {

        if (data) {

            this._data = data;
            this.slideObjects = [];

            var tempData;

            for (var i = 0; i < data.stsi.length; i += 1) {
                tempData = _extra.captivate.api.getDisplayObjByCP_UID(data.stsi[i]);
                this.slideObjects.push({
                    // Formatted Data for slideObject within state.
                    "upperDIV":tempData.actualParent,
                    "contentDIV":tempData.element.parentNode,
                    "originalX":tempData.bounds.minX,
                    "originalY":tempData.bounds.minY,
                    "originalWidth":tempData.bounds.maxX - tempData.bounds.minX,
                    "originalHeight":tempData.bounds.maxY - tempData.bounds.minY,
                    "rawData":tempData
                });
            }

            this.primaryObject = this.slideObjects[0];

        }
    }

    StateDataProxy.prototype = {
        get name() {
            return this._data.stn;
        },




        get x () {
            return removePXSuffix(this.primaryObject.upperDIV.style.left);
        },
        set x (value) {

            doCSSPropertySet(value, "originalX", "left", this);

        },


        get y () {
            return removePXSuffix(this.primaryObject.upperDIV.style.top);
        },
        set y (value) {

            doCSSPropertySet(value, "originalY", "top", this);

        },


        get width () {
            return removePXSuffix(this.primaryObject.upperDIV.style.width);
        },
        set width (value) {

            doCSSPropertySet(value, "originalWidth", "width", this);

        },


        get height () {
            return removePXSuffix(this.primaryObject.upperDIV.style.height);
        },
        set height (value) {

            doCSSPropertySet(value, "originalHeight", "height", this);

        },



        get originalX() {
            return this.primaryObject.originalX;
        },
        get originalY() {
            return this.primaryObject.originalY;
        }
    };

    StateDataProxy.prototype.addEventListener = function (eventName, callback) {
        this.slideObjects.forEach(function (data) {
            data.upperDIV.addEventListener(eventName, callback);
        });
    };

    StateDataProxy.prototype.removeEventListener = function (eventName, callback) {
        this.slideObjects.forEach(function (data) {
            data.upperDIV.removeEventListener(eventName, callback);
        });
    };

    StateDataProxy.prototype.setAttribute = function (property, value) {
        this.slideObjects.forEach(function (data) {
            data.upperDIV.setAttribute(property, value);
            data.contentDIV.setAttribute(property, value);
        });

    };

    StateDataProxy.prototype.addClass = function (className) {
        this.slideObjects.forEach(function (data) {
            _extra.cssManager.addClassTo(data.upperDIV, className);
            _extra.cssManager.addClassTo(data.contentDIV, className);
        });
    };

    StateDataProxy.prototype.removeClass = function(className) {
        this.slideObjects.forEach(function (data) {
            _extra.cssManager.removeClassFrom(data.upperDIV, className);
            _extra.cssManager.removeClassFrom(data.contentDIV, className);
        });
    };

    StateDataProxy.prototype.editCSS = function(property, value) {
        this.slideObjects.forEach(function (data) {
            _extra.cssManager.editCSSOn(data.upperDIV, property, value);
            _extra.cssManager.editCSSOn(data.contentDIV, property, value);
        });
    };

    _extra.registerClass("StateDataProxy", StateDataProxy);

}, _extra.CAPTIVATE);