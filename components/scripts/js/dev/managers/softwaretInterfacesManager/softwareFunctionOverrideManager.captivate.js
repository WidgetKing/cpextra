/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/11/15
 * Time: 3:30 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("softwareFunctionOverrideManager", ["hookManager", "eventManager", "softwareInterfacesManager", "CustomEvent"], function () {

    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// Enter Frame
    ///////////////////////////////////////////////////////////////////////
    _extra.addHookAfter(_extra.captivate.movie, "_onEnterFrame", function () {

        _extra.eventManager.eventDispatcher.dispatchEvent(_extra.createEvent("enterframe"));

    });

    _extra.executeOnNextFrame = function (method) {

        var handler = function () {
            method();
            _extra.eventManager.eventDispatcher.removeEventListener("enterframe", handler);
        };

        _extra.eventManager.eventDispatcher.addEventListener("enterframe", handler);

    };


}, _extra.CAPTIVATE);