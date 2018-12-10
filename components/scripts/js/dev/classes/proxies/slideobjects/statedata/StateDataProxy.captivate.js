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
    /////////////// CONSTRUCTOR
    ///////////////////////////////////////////////////////////////////////

    function StateDataProxy(data, editDataForSlideObjectType) {

        // Used with shapes to account for their strokes
        this.hasOriginalPosition = false;

        if (data) {


            this._data = data;
            this.slideObjects = [];

            this.initializeSubSlideObjects(editDataForSlideObjectType);

            this.addEnterExitHandlers();

            if (this.isInitialized) {
                this.calculateFirstSlideOriginalPosition();
            }

        }
    }



    ///////////////////////////////////////////////////////////////////////
    /////////////// Properties
    ///////////////////////////////////////////////////////////////////////
    StateDataProxy.prototype = {


        get name() {
            return this._data.stn;
        },


        get x () {

            return this.getProperty({
                "CSSProperty":"left",
                "pixelOffset": this.primaryObject.offsetX
            });

        },
        set x (value) {

            this.setProperty({
                "value":value,
                "writeToCSS":["l","lhV"],
                "CSSProperty":"left",
                "propertyToOffsetWithPrimaryObject":"originalX",
                "pixelOffset":this.primaryObject.offsetX
            });

        },


        get y () {

            return this.getProperty({
                "CSSProperty":"top",
                "pixelOffset": this.primaryObject.offsetY
            });

        },
        set y (value) {

            this.setProperty({
                "value":value,
                "writeToCSS":["t","lvV"],
                "CSSProperty":"top",
                "propertyToOffsetWithPrimaryObject":"originalY",
                "pixelOffset":this.primaryObject.offsetY
            });

        },


        get width () {
            return this.removePXSuffix(this.primaryObject.upperDIV.style.width);
        },
        set width (value) {

            this.doCSSPropertySet(value, "originalWidth", "width");

        },


        get height () {
            return this.removePXSuffix(this.primaryObject.upperDIV.style.height);
        },
        set height (value) {

            this.doCSSPropertySet(value, "originalHeight", "height");

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
            return this.primaryObject.rawData.isDrawn;
        }
    };


    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// Methods
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    /////////////// Initialization Methods
    ///////////////////////////////////////////////////////////////////////
    StateDataProxy.prototype.initializeSubSlideObjects = function (editDataForSlideObjectType) {

        var nativeController,
            formattedData,
            uid;

        for (var i = 0; i < this._data.stsi.length; i += 1) {

            uid = this._data.stsi[i];

            nativeController = _extra.captivate.api.getDisplayObjByCP_UID(uid);

            if (nativeController) {

                formattedData = this.formatDataViaNativeController(nativeController);

            } else {

                formattedData = this.formatDataBySlideObjectData(_extra.dataManager.getSlideObjectDataByID(uid));

            }

            // Find the draw method (this may be changed by child classes)
            if (editDataForSlideObjectType) {
                editDataForSlideObjectType(formattedData);
            }

            this.slideObjects.push(formattedData);


        }

        this.primaryObject = this.slideObjects[0];
    };

    StateDataProxy.prototype.formatDataBySlideObjectData = function (rawStateData) {

        var nativeElement = _extra.dataManager.getSlideObjectDataByName(rawStateData.baseItemName),
            nativeController = _extra.captivate.api.getDisplayObjByCP_UID(nativeElement.uid),
            stateItemData;

        stateItemData = this.formatDataViaNativeController(nativeController);

        //stateItemData.originalX = rawStateData.originalX;
        //stateItemData.originalY = rawStateData.originalY;
        stateItemData.originalWidth = rawStateData.originalWidth;
        stateItemData.originalHeight = rawStateData.originalHeight;

        return stateItemData;
    };

    StateDataProxy.prototype.formatDataViaNativeController = function (nativeController) {

        return {

            "upperDIV":        nativeController.actualParent,
            "contentDIV":      nativeController.element.parentNode,
            "focusDIVId":      nativeController.parentDivName,
            "originalX":       _extra.slideObjects.locationManager.getOriginalX(nativeController),
            "originalY":       _extra.slideObjects.locationManager.getOriginalY(nativeController),
            "offsetX":         0,
            "offsetY":         0,
            "originalWidth":   nativeController.bounds.maxX - nativeController.bounds.minX,
            "originalHeight":  nativeController.bounds.maxY - nativeController.bounds.minY,
            "canvasContext":   (nativeController.element.getContext) ? nativeController.element.getContext("2d") : null,
            "name":            nativeController.divName || nativeController.parentDivName,
            "rawData":         nativeController,

            // Investigate: DisplayObject.prototype.subscribeToItemDrawingCompleteHandler
            // May only work for responsive.

            "enterMethodName": "drawComplete",
            "exitMethodName":  "reset",

            "isPositionedByPercentage": _extra.slideObjects.locationManager.
                                        isPositionedByPercentage(nativeController)

        };
    };

    StateDataProxy.prototype.calculateFirstSlideOriginalPosition = function () {

        // Prevent this from being called twice
        // And make sure it doesn't get called on the first time we view this slide
        /*if (!this.hasOriginalPosition && this.primaryObject.rawData.virgin === false) {
            this.hasOriginalPosition = true;

            var currentX = this.x,
                currentY = this.y,
                originalOriginalX = this.primaryObject.originalX,
                originalOriginalY = this.primaryObject.originalY;

            this.slideObjects.forEach(function (data) {

                data.originalX = currentX - (originalOriginalX - data.originalX);
                data.originalY = currentY - (originalOriginalY - data.originalY);

            });
        }*/
    };

    StateDataProxy.prototype.addEnterExitHandlers = function () {

        var that = this;

        this.enterHandler = function () {

            that.calculateFirstSlideOriginalPosition();
            that.dispatchEvent("internalinitialization");

        };

        this.exitHandler = function () {

            that.dispatchEvent("internalunload");

        };

        // TODO: Test that one time hooks work correctly in this situation
        // To trigger the ENTER event for slide objects.
        _extra.addOneTimeHook(this.primaryObject.rawData, this.primaryObject.enterMethodName, this.enterHandler);

        // To trigger the EXIT event for slide objects.
        _extra.addOneTimeHook(this.primaryObject.rawData, this.primaryObject.exitMethodName, this.exitHandler);

    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// Positioning Methods
    ///////////////////////////////////////////////////////////////////////

    StateDataProxy.prototype.getProperty = function (data) {

        var value = _extra.w.parseFloat(this.primaryObject.upperDIV.style[data.CSSProperty]);

        if (this.primaryObject.isPositionedByPercentage) {
            return this.convertPercentageToPixel(value, data.CSSProperty) + data.pixelOffset;
        } else {
            return value + data.pixelOffset;
        }

    };

    StateDataProxy.prototype.setProperty = function (data) {

        data.value -= data.pixelOffset;

        if (_extra.captivate.isResponsive && data.writeToCSS) {

            for (var i = 0; i < data.writeToCSS.length; i += 1) {
                this.writeToCaptivateCSSRecord(data.writeToCSS[i], data.CSSProperty, data.value, data.propertyToOffsetWithPrimaryObject);
            }

        }


        this.doCSSPropertySet(data.value, data.propertyToOffsetWithPrimaryObject, data.CSSProperty);
    };

    StateDataProxy.prototype.removePXSuffix = function (value) {

        if (value.substr(value.length - 2, 2) === "px") {
            value = value.substr(0,value.length - 2);
        }

        return _extra.w.parseFloat(value);

    };


    StateDataProxy.prototype.doCSSPropertySet = function (value, offsetProperty, cssProperty) {

        var primaryObjectLocation = this.primaryObject[offsetProperty],
            that = this;

        this.slideObjects.forEach(function (data) {

            var valueForSlideObject = value;
            // Offset from the primary object
            valueForSlideObject -= primaryObjectLocation - data[offsetProperty];

            if (that.primaryObject.isPositionedByPercentage) {

                valueForSlideObject = that.convertPixelToPercentage(valueForSlideObject, cssProperty) + "%";

            } else {

                valueForSlideObject = valueForSlideObject + "px";

            }

            _extra.cssManager.editCSSOn(data.upperDIV, cssProperty, valueForSlideObject);
            _extra.cssManager.editCSSOn(data.contentDIV, cssProperty, valueForSlideObject);

        });

    };


    StateDataProxy.prototype.writeToCaptivateCSSRecord = function (minifiedProperty, cssProperty, value, offsetProperty) {

        var responsiveCSS,
            valueForSlideObject,
            that = this,
            offset = this.primaryObject[offsetProperty];

        this.slideObjects.forEach(function (data) {

            valueForSlideObject = value;
            valueForSlideObject -= offset - data[offsetProperty];

            responsiveCSS = _extra.captivate.api.getResponsiveCSS(data.rawData.responsiveCSS);

            if (data.isPositionedByPercentage) {

                responsiveCSS[minifiedProperty] = that.convertPixelToPercentage(valueForSlideObject, cssProperty) + "%";

            } else {
                //responsiveCSS[minifiedProperty] = value + "px";
                responsiveCSS[minifiedProperty] = valueForSlideObject + "px";
            }

        });

    };

    StateDataProxy.prototype.convertPixelToPercentage = function (value, property, width, height) {

        var max;

        if (property === "left") {

            if (!width) {
                width = _extra.captivate.getProjectWidth();
            }

            max = width;

        } else if (property === "top") {

            if (!height) {
                height = _extra.captivate.getProjectHeight();
            }

            max = height;

        }

        return (value / max) * 100;

    };

    StateDataProxy.prototype.convertPercentageToPixel = function (value, property) {

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

    };



    ///////////////////////////////////////////////////////////////////////
    /////////////// Utility Methods
    ///////////////////////////////////////////////////////////////////////

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



    ///////////////////////////////////////////////////////////////////////
    /////////////// Unload Methods
    ///////////////////////////////////////////////////////////////////////
    StateDataProxy.prototype.unload = function() {

        this.primaryObject.rawData.virgin = false;

        if (this.enterHandler && this.exitHandler) {
            // To trigger the ENTER event for slide objects.
            _extra.removeHook(this.primaryObject.rawData, this.primaryObject.enterMethodName, this.enterHandler);

            // To trigger the EXIT event for slide objects.
            _extra.removeHook(this.primaryObject.rawData, this.primaryObject.exitMethodName, this.exitHandler);
        }

        // If we've been writing to the responsive project data while using this state then now that we're unloading the state
        // we should apply the original data so that it doesn't mess up the originalX the next time we return.
        if (_extra.captivate.isResponsive) {

            this.writeToCaptivateCSSRecord("l", "left", this.originalX, "originalX");
            this.writeToCaptivateCSSRecord("lhV", "left", this.originalX, "originalX");

            this.writeToCaptivateCSSRecord("t", "top", this.originalY, "originalY");
            this.writeToCaptivateCSSRecord("lvV", "top", this.originalY, "originalY");

        }
    };

    _extra.registerClass("StateDataProxy", StateDataProxy);

}, _extra.CAPTIVATE);