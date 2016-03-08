/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/12/15
 * Time: 2:32 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("VideoStateDataProxy", ["StateDataProxy"], function () {

    "use strict";

    function VideoStateDataProxy(data) {

        _extra.classes.StateDataProxy.call(this, data, function (data) {

            _extra.test = data.rawData;

            if (_extra.captivate.isResponsive) {

                data.drawMethodObject = data.rawData;
                data.drawMethodName = "drawForResponsive";
                data.timeout = 1;

            } else {

                data.drawMethodObject = data.rawData;
                data.drawMethodName = "addNativeVideoIfNeeded";//"showControls";

            }

        });

    }

    _extra.registerClass("VideoStateDataProxy", VideoStateDataProxy, "StateDataProxy", _extra.CAPTIVATE);

}, _extra.CAPTIVATE);