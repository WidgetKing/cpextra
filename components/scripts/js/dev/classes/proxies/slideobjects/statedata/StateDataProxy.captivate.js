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



    function writeToCaptivateCSSRecord (minifiedProperty, cssProperty, value, that) {

        var responsiveCSS;

        that.slideObjects.forEach(function (data) {

            responsiveCSS = _extra.captivate.api.getResponsiveCSS(data.rawData.responsiveCSS);
            if (data.isPositionedByPercentage) {
                responsiveCSS[minifiedProperty] = convertPixelToPercentage(value, cssProperty) + "%";
            } else {
                responsiveCSS[minifiedProperty] = value + "px";
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

    function StateDataProxy(data, setDrawMethod, hasBeenDrawn) {

        this.pixelOffset = 0;

        if (!setDrawMethod) {

            setDrawMethod = function (data) {

                if (_extra.captivate.isResponsive) {

                    data.drawMethodObject = data.rawData;
                    data.drawMethodName = "drawForResponsive";
                    data.timeout = 1;

                } else {

                    data.drawMethodObject = data.canvasContext;
                    data.drawMethodName = "drawImage";

                }

                /*
                // This is in case of a test entry box. (Note to self, this whole place needs a lot of cleaning up)
                if (!formattedData.upperDIV) {
                    formattedData.upperDIV = _extra.w.document.getElementById(formattedData.name + "c");
                    formattedData.drawMethodObject = tempData;
                    formattedData.drawMethodName = "addIfNeeded";
                // Mostly for shapes.
                } else {

                    // TODO: Fix issue I002 - See XCMND_SOP-1.2 for details.
                    // Closely related should be I001. See same document.
                    formattedData.drawMethodObject = formattedData.canvasContext;
                }*/


            };

        }

        if (!hasBeenDrawn) {

            hasBeenDrawn = function (data) {
                return data.rawData.isDrawn;
            };

        }

        if (data) {

            this._data = data;
            this.slideObjects = [];

            ///////////////////////////////////////////////////////////////////////
            /////////////// PRIVATE VARIABLES
            ///////////////////////////////////////////////////////////////////////
            var tempData,
                formattedData,
                onDrawCallbacks = [],
                that = this,
                safeToExecuteCallbacks = false;

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

                // Find the draw method (this may be changed by child classes)
                setDrawMethod(formattedData);

                this.slideObjects.push(formattedData);

            }

            this.primaryObject = this.slideObjects[0];




            ///////////////////////////////////////////////////////////////////////
            /////////////// ON DRAW IMAGE CALLBACKS
            ///////////////////////////////////////////////////////////////////////
            ////////////////////////////////
            ////////// Methods
            this.addOnDrawCallback = function (method) {
                onDrawCallbacks.push(method);
                if (safeToExecuteCallbacks) {
                    method();
                }
            };
            this.removeOnDrawCallback = function (method) {
                for (var i = 0; i < onDrawCallbacks.length; i += 1) {

                    if (onDrawCallbacks[i] === method) {

                        onDrawCallbacks.splice(i,1);

                    }

                }
            };


            var getOriginalPosition = function () {

                var primaryX = that.x,
                    primaryY = that.y,
                    originalOriginalX = that.primaryObject.originalX,
                    originalOriginalY = that.primaryObject.originalY;

                that.slideObjects.forEach(function (data) {

                    data.originalX = primaryX - (originalOriginalX - data.originalX);
                    data.originalY = primaryY - (originalOriginalY - data.originalY);

                });

            };

            ////////////////////////////////
            ////////// Setup

            // If this object uses an object to display.
            if (this.primaryObject.drawMethodObject) {

                ////////////////////////////////
                ////////// Execute callbacks
                var onSlideObjectDrawn = function () {

                    getOriginalPosition();

                    safeToExecuteCallbacks = true;

                    // We reverse through this, because many of these handlers will probably remove themselves.
                    for (var i = onDrawCallbacks.length - 1; i >= 0; i -= 1) {

                        onDrawCallbacks[i]();

                    }


                };


                ////////////////////////////////
                ////////// Detect if has already been drawn
                if (hasBeenDrawn(this.primaryObject)) {

                    // Object has already been drawn. Execute all callbacks
                    onSlideObjectDrawn();

                } else {

                    var drawHook = function () {

                        // Object hasn't been drawn. Detect when it is drawn and then execute callbacks
                        if (that.primaryObject.timeout) {

                            _extra.w.setTimeout(onSlideObjectDrawn, that.primaryObject.timeout);

                        } else {

                            onSlideObjectDrawn();

                        }

                        _extra.removeHook(that.primaryObject.drawMethodObject, that.primaryObject.drawMethodName, drawHook);

                    };

                    _extra.addHook(this.primaryObject.drawMethodObject, this.primaryObject.drawMethodName, drawHook);

                }

            } else {

                // This object doesn't use a canvas to display (like a Button)
                safeToExecuteCallbacks = true;
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

                writeToCaptivateCSSRecord("l", "left", value, this);
                writeToCaptivateCSSRecord("lhV", "left", value, this);

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

                writeToCaptivateCSSRecord("t", "top", value, this);
                writeToCaptivateCSSRecord("lvV", "top", value, this);

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