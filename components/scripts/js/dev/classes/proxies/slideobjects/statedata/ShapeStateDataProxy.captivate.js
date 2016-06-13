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

}, _extra.CAPTIVATE);