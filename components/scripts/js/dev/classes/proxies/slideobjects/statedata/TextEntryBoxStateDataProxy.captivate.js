/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/12/15
 * Time: 1:56 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("TextEntryBoxStateDataProxy", ["StateDataProxy"], function () {

    "use strict";

    function TextEntryBoxStateDataProxy(data) {

        var name = data.name;

        _extra.classes.StateDataProxy.call(this, data, function (data) {

            if (!data.name) {
                data.name = name;
            }

            data.upperDIV = _extra.w.document.getElementById(data.name + "c");

            // Short answer field
            if (!data.upperDIV) {
                data.upperDIV = _extra.w.document.getElementById(data.name + "sha_inputField");
            }

            /*if (_extra.captivate.isResponsive) {

                data.drawMethodObject = data.rawData;
                data.drawMethodName = "drawForResponsive";
                data.timeout = 1;

            } else {

                data.drawMethodObject = data.rawData;
                data.drawMethodName = "addIfNeeded";

            }*/

        });

    }

    _extra.registerClass("TextEntryBoxStateDataProxy", TextEntryBoxStateDataProxy, "StateDataProxy", _extra.CAPTIVATE);

}, _extra.CAPTIVATE);