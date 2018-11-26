/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 2:12 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("cpMateManager", ["softwareInterfacesManager"], function () {

    "use strict";

    var callback = new _extra.classes.Callback();

    _extra.cpMate = {
        "register": function (slideObjectName, listener) {
            callback.addCallback(slideObjectName, listener);
        },
        "deregister": function (slideObjectName, listener) {
            callback.removeCallback(slideObjectName, listener);
        },
        "broadcastTo": function (slideObjectName, parameters) {
            callback.sendToCallback(slideObjectName, parameters);
        }
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// Pause / Resume handling
    ///////////////////////////////////////////////////////////////////////
    _extra.captivate.eventDispatcher.addEventListener(_extra.captivate.events.MOVIE_PAUSE, function () {
        _extra.cpMate.broadcastTo("*", {
            "action":"moviePause",
            "parameters":[]
        });
    });

    _extra.captivate.eventDispatcher.addEventListener(_extra.captivate.events.MOVIE_RESUME, function () {
        _extra.cpMate.broadcastTo("*", {
            "action":"movieResume",
            "parameters":[]
        });
    });


});