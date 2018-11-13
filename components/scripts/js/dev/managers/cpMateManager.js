/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 2:12 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("cpMateManager", [], function () {

    "use strict";

    var callback = new _extra.classes.Callback();

    _extra.cpMate = {
        "register": function (slideObjectName, listener) {
            callback.addCallback(slideObjectName, listener);
        },
        "deregister": function (slideObjectName) {
            callback.removeIndex(slideObjectName);
        },
        "broadcastTo": function (slideObjectName, parameters) {
            callback.sendToCallback(slideObjectName, parameters);
        }
    };

});