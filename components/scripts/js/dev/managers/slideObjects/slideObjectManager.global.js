/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 6:06 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectManager_global", ["slideObjectManager_software"], function () {
    "use strict";

    var slideObjectProxies = {};

    _extra.slideObjects.WILDCARD_CHARACTER = "@";
    _extra.slideObjects.getSlideObjectProxy = function (id) {

        var DOMElement;

        // If we were passed in a DOM element rather than the id of a DOM element...
        if (typeof id === "object") {
            DOMElement = id;
            id = DOMElement.id;
        } else {
            // We were given the id of a dom element, so we have to find it.
            _extra.w.document.getElementById(id);
        }

        if (!slideObjectProxies[id]) {
            slideObjectProxies[id] = _extra.factories.createSlideObjectProxy(id, DOMElement);
        }

        return slideObjectProxies[id];

    };

    // TODO: Should clear slideObjectProxies when entering a new slide.
});