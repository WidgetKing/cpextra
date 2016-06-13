/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/12/15
 * Time: 2:05 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("ClickBoxStateDataProxy", ["StateDataProxy"], function () {

    "use strict";

    function ClickBoxStateDataProxy(data) {

        _extra.classes.StateDataProxy.call(this, data, function (data) {

            /*if (_extra.captivate.isResponsive) {

                data.drawMethodObject = data.rawData;
                data.drawMethodName = "drawForResponsive";
                data.timeout = 1;

            } else {

                data.drawMethodObject = data.rawData;
                data.drawMethodName = "drawIfNeeded";

            }*/

        });

    }

    _extra.registerClass("ClickBoxStateDataProxy", ClickBoxStateDataProxy, "StateDataProxy", _extra.CAPTIVATE);

}, _extra.CAPTIVATE);