/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/12/15
 * Time: 10:58 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("ShapeStateDataProxy", ["StateDataProxy"], function () {

    "use strict";

    function ShapeStateDataProxy(data) {

        _extra.classes.StateDataProxy.call(this, data, function (data) {

            /*if (_extra.captivate.isResponsive) {

                data.drawMethodObject = data.rawData;
                data.drawMethodName = "drawForResponsive";
                data.timeout = 1;

            } else {

                data.drawMethodObject = data.canvasContext;
                data.drawMethodName = "lineTo";

            }*/

            _extra.slideObjects.states.fixMissingMouseOutIssue(data.rawData, "parentId");


            /*if (data.rawData.canvasObj) {

                // sw stands for Stroke Width
                var strokeWidth = data.rawData.canvasObj.sw;

                if (strokeWidth > 0) {

                    data.originalX -= strokeWidth * 2;
                    data.originalY -= strokeWidth * 2;

                }
            }*/

        });

    }

    _extra.registerClass("ShapeStateDataProxy", ShapeStateDataProxy, "StateDataProxy", _extra.CAPTIVATE);

    /*var strokeCContainerDifference = {
        "1":-2,
        "2":1,
        "3":4,
        "4":7,
        "5":10,
        "6":13,
        "7":16,
        "8":19,
        "9":22,
        "10":25
    };

    var originalLocationStrokeDifferences = {
        "0":0,
        "1":0.5,
        "2":1,
        "3":1.5,
        "4":2,
        "5":2.5,
        "6":3,
        "7":3.5,
        "8":4,
        "9":4.5,
        "10":5
    }; */

    ShapeStateDataProxy.prototype.calculateOffsetWithOriginal = function(strokeWidth) {
        return strokeWidth * 0.5;
    };

    ShapeStateDataProxy.prototype.calculateCContainerOffset = function(strokeWidth) {
        return _extra.w.Math.max((strokeWidth * 3) - 5,
                                 0);
    };

    ShapeStateDataProxy.prototype.formatDataViaNativeController = function(rawStateData) {

        // Super!
        var stateItemData = ShapeStateDataProxy.superClass.formatDataViaNativeController.call(this, rawStateData),
            pixelOffset,
            slideObjectData = _extra.dataManager.getSlideObjectDataByName(stateItemData.name);

        pixelOffset = stateItemData.originalX - slideObjectData.originalX;

        if (_extra.captivate.isResponsive) {
            pixelOffset += this.calculateOffsetWithOriginal(slideObjectData.strokeThickness);
        }

        stateItemData.offsetX = pixelOffset;
        stateItemData.offsetY = pixelOffset;

        return stateItemData;
    };

}, _extra.CAPTIVATE);