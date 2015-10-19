/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 3:52 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectManager_software", ["generalDataManager", "Callback", "slideManager_global"], function () {

    "use strict";

    _extra.slideObjects = {
        "getSlideObjectElement": function(id) {
            _extra.log("_extra.slideObjects.getSlideObjectElement has yet to be defined");
            return _extra.w.document.getElementById(id);
        }
    };

    ////////////////////
    //////// ON LOAD CALLBACK
    ////////////////////
    return function () {

    };

}, _extra.STORYLINE);