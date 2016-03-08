/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/12/15
 * Time: 2:26 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("WidgetStateDataProxy", ["StateDataProxy"], function () {

    "use strict";

    function WidgetStateDataProxy(data) {

        _extra.classes.StateDataProxy.call(this, data, function (data) {

            data.upperDIV = data.contentDIV;

            if (_extra.captivate.isResponsive) {

                data.drawMethodObject = data.rawData;
                data.drawMethodName = "drawForResponsive";
                data.timeout = 1;

            } else {

                data.drawMethodObject = data.canvasContext;
                data.drawMethodName = "drawImage";

            }

        });

    }

    _extra.registerClass("WidgetStateDataProxy", WidgetStateDataProxy, "StateDataProxy", _extra.CAPTIVATE);

}, _extra.CAPTIVATE);