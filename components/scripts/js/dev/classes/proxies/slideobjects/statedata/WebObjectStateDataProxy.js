/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/12/15
 * Time: 2:19 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("WebObjectStateDataProxy", ["StateDataProxy"], function () {

    "use strict";

    function WebObjectStateDataProxy(data) { //loadWebObject

        _extra.classes.StateDataProxy.call(this, data, function (data) {

            //data.upperDIV = data.contentDIV;
            data.enterMethodName = "loadWebObject";

        });

    }

    _extra.registerClass("WebObjectStateDataProxy", WebObjectStateDataProxy, "StateDataProxy", _extra.CAPTIVATE);

}, _extra.CAPTIVATE);