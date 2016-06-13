/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/10/15
 * Time: 10:59 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("StateDataProxy", ["softwareInterfacesManager"], function () {

    "use strict";


    ///////////////////////////////////////////////////////////////////////
    /////////////// PRIVATE STATIC FUNCTIONS
    ///////////////////////////////////////////////////////////////////////
    function removePXSuffix(value) {
        if (value.substr(value.length - 2, 2) === "px") {
            value = value.substr(0,value.length - 2);
        }

        return _extra.w.parseFloat(value);
    }

    function doCSSPropertySet(value, offsetProperty, cssProperty, that) {

        var offset = that.primaryObject[offsetProperty];

        that.slideObjects.forEach(function (data) {

            var valueForSlideObject = value;
            valueForSlideObject -= offset - data[offsetProperty];

            if (that.primaryObject.isPositionedByPercentage) {

                valueForSlideObject = convertPixelToPercentage(valueForSlideObject, cssProperty) + "%";

            } else {

                valueForSlideObject = valueForSlideObject + "px";

            }

            _extra.cssManager.editCSSOn(data.upperDIV, cssProperty, valueForSlideObject);
            _extra.cssManager.editCSSOn(data.contentDIV, cssProperty, valueForSlideObject);

        });

    }



    function writeToCaptivateCSSRecord (minifiedProperty, cssProperty, value, that, offsetProperty) {

        var responsiveCSS,
            valueForSlideObject,
            offset = that.primaryObject[offsetProperty];

        that.slideObjects.forEach(function (data) {

            valueForSlideObject = value;
            valueForSlideObject -= offset - data[offsetProperty];

            responsiveCSS = _extra.captivate.api.getResponsiveCSS(data.rawData.responsiveCSS);
            if (data.isPositionedByPercentage) {
                //responsiveCSS[minifiedProperty] = convertPixelToPercentage(value, cssProperty) + "%";
                responsiveCSS[minifiedProperty] = convertPixelToPercentage(valueForSlideObject, cssProperty) + "%";
            } else {
                //responsiveCSS[minifiedProperty] = value + "px";
                responsiveCSS[minifiedProperty] = valueForSlideObject + "px";
            }

        });

    }

    function convertPixelToPercentage(value, property) {

        var max;

        if (property === "left") {
            max = _extra.captivate.getProjectWidth();
        } else if (property === "top") {
            max = _extra.captivate.getProjectHeight();
        }

        return (value / max) * 100;

    }

    function convertPercentageToPixel(value, property) {

        var max;

        if (property === "left") {
            max = _extra.captivate.getProjectWidth();
        } else if (property === "top") {
            max = _extra.captivate.getProjectHeight();
        }

        // Round to the nearest 2nd decimal.
        value = _extra.w.Math.round(max * value);
        value = value / 100;

        return value;

    }








    ///////////////////////////////////////////////////////////////////////
    /////////////// CONSTRUCTOR
    ///////////////////////////////////////////////////////////////////////

    function StateDataProxy(data, editDataForSlideObjectType, hasBeenDrawn) {

        this.pixelOffset = 0;

        /*if (!editDataForSlideObjectType) {

            editDataForSlideObjectType = function (data) {

                if (_extra.captivate.isResponsive) {

                    data.drawMethodObject = data.rawData;
                    data.drawMethodName = "drawForResponsive";
                    data.timeout = 1;

                } else {

                    data.drawMethodObject = data.canvasContext;
                    data.drawMethodName = "drawImage";

                }


            };

        }*/


        //////// HAS BEEN DRAWN METHOD
        if (!hasBeenDrawn) {

            hasBeenDrawn = function (data) {
                return data.rawData.isDrawn;
            };

        }

        // Assign it to the instance so this.isInitialized can work
        this._hasBeenDrawn = hasBeenDrawn;

        if (data) {

            this._data = data;
            this.slideObjects = [];

            ///////////////////////////////////////////////////////////////////////
            /////////////// PRIVATE VARIABLES
            ///////////////////////////////////////////////////////////////////////
            var tempData,
                formattedData,
                that = this;

            ///////////////////////////////////////////////////////////////////////
            /////////////// GET DATA
            ///////////////////////////////////////////////////////////////////////
            for (var i = 0; i < data.stsi.length; i += 1) {

                tempData = _extra.captivate.api.getDisplayObjByCP_UID(data.stsi[i]);

                formattedData = {
                    // Formatted Data for slideObject within state.
                    "upperDIV":tempData.actualParent,
                    "contentDIV":tempData.element.parentNode,
                    "originalX":tempData.bounds.minX,
                    "originalY":tempData.bounds.minY,
                    "originalWidth":tempData.bounds.maxX - tempData.bounds.minX,
                    "originalHeight":tempData.bounds.maxY - tempData.bounds.minY,
                    "canvasContext": (tempData.element.getContext) ? tempData.element.getContext("2d") : null,
                    "name":tempData.divName || tempData.parentDivName,
                    "rawData":tempData
                };

                // Get isPositionedByPercentage
                if (formattedData.rawData.responsiveCSS) {
                    formattedData.isPositionedByPercentage =
                            formattedData.rawData.responsiveCSS[_extra.captivate.getResponsiveProjectWidth()].
                                   l.indexOf("%") > -1;
                } else {
                    formattedData.isPositionedByPercentage = false;
                }

                formattedData.enterMethodName = "drawComplete";
                formattedData.exitMethodName = "reset";

                // Find the draw method (this may be changed by child classes)
                if (editDataForSlideObjectType) {
                    editDataForSlideObjectType(formattedData);
                }

                this.slideObjects.push(formattedData);

            }

            this.primaryObject = this.slideObjects[0];




            /*var addHook = function (location, name) {

                _extra.addHookBefore(location, name, function () {
                    _extra.log(name);
                });

            };


            var target;
            for (var propertyName in this.primaryObject.rawData) {
                target = this.primaryObject.rawData[propertyName];
                if (typeof target === "function") {

                    addHook(this.primaryObject.rawData, propertyName);

                }
            }*/

            this.enterHandler = function () {
                if (getOriginalPosition) {
                    getOriginalPosition();
                }
                that.dispatchEvent("internalinitialization");
            };

            this.exitHandler = function () {
                that.dispatchEvent("internalunload");
            };

            // To trigger the ENTER event for slide objects.
            _extra.addHook(this.primaryObject.rawData, this.primaryObject.enterMethodName, this.enterHandler);

            // To trigger the EXIT event for slide objects.
            _extra.addHook(this.primaryObject.rawData, this.primaryObject.exitMethodName, this.exitHandler);


            var getOriginalPosition = function () {

                // Prevent this from being called twice;
                getOriginalPosition = null;

                var primaryX = that.x,
                    primaryY = that.y,
                    originalOriginalX = that.primaryObject.originalX,
                    originalOriginalY = that.primaryObject.originalY;

                that.slideObjects.forEach(function (data) {

                    data.originalX = primaryX - (originalOriginalX - data.originalX);
                    data.originalY = primaryY - (originalOriginalY - data.originalY);

                });

            };

            if (this.isInitialized) {
                getOriginalPosition();
            }

        }

    }

    StateDataProxy.prototype = {


        get name() {
            return this._data.stn;
        },


        get x () {

            var value = _extra.w.parseFloat(this.primaryObject.upperDIV.style.left);

            if (this.primaryObject.isPositionedByPercentage) {
                return convertPercentageToPixel(value, "left") + this.pixelOffset;
            } else {
                return value + this.pixelOffset;
            }

        },
        set x (value) {
            value += this.pixelOffset;

            if (_extra.captivate.isResponsive) {

                writeToCaptivateCSSRecord("l", "left", value, this, "originalX");
                writeToCaptivateCSSRecord("lhV", "left", value, this, "originalX");

            }


            doCSSPropertySet(value, "originalX", "left", this);

        },


        get y () {

            var value = _extra.w.parseFloat(this.primaryObject.upperDIV.style.top);

            if (this.primaryObject.isPositionedByPercentage) {
                return convertPercentageToPixel(value, "top") - this.pixelOffset;
            } else {
                return value - this.pixelOffset;
            }

        },
        set y (value) {

            value += this.pixelOffset;

            if (_extra.captivate.isResponsive) {

                writeToCaptivateCSSRecord("t", "top", value, this, "originalY");
                writeToCaptivateCSSRecord("lvV", "top", value, this, "originalY");

            }

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
        },

        get internalIndex() {
            return this._data.stt;
        },

        get isInitialized() {
            return this._hasBeenDrawn(this.primaryObject);
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

    StateDataProxy.prototype.dispatchEvent = function (eventName) {
        this.primaryObject.upperDIV.dispatchEvent(_extra.createEvent(eventName));
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

    StateDataProxy.prototype.unload = function() {

        if (this.enterHandler && this.exitHandler) {
            // To trigger the ENTER event for slide objects.
            _extra.removeHook(this.primaryObject.rawData, this.primaryObject.enterMethodName, this.enterHandler);

            // To trigger the EXIT event for slide objects.
            _extra.removeHook(this.primaryObject.rawData, this.primaryObject.exitMethodName, this.exitHandler);
        }

        // If we've been writing to the responsive project data while using this state then now that we're unloading the state
        // we should apply the original data so that it doesn't mess up the originalX the next time we return.
        if (_extra.captivate.isResponsive) {

            writeToCaptivateCSSRecord("l", "left", this.originalX, this, "originalX");
            writeToCaptivateCSSRecord("lhV", "left", this.originalX, this, "originalX");

            writeToCaptivateCSSRecord("t", "top", this.originalY, this, "originalY");
            writeToCaptivateCSSRecord("lvV", "top", this.originalY, this, "originalY");

        }
    };

    _extra.registerClass("StateDataProxy", StateDataProxy);

}, _extra.CAPTIVATE);