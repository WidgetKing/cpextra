/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/11/15
 * Time: 11:13 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("hookManager", ["slideManager_global"], function () {

    "use strict";

    var hooks = [];

    ///////////////////////////////////////////////////////////////////////
    /////////////// PRIVATE FUNCTIONS
    ///////////////////////////////////////////////////////////////////////


    function createHook(data) {
        data.location[data.methodName] = function () {

            data.hookMethod.apply(this, arguments);
            data.originalMethod.apply(this, arguments);

        };
    }

    function destroyHook(data) {
        data.location[data.methodName] = data.originalMethod;
    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// PUBLIC FUNCTIONS
    ///////////////////////////////////////////////////////////////////////

    _extra.addHook = function (location, methodName, hookMethod) {

        var data = {
            "location": location,
            "methodName": methodName,
            "hookMethod": hookMethod,
            "originalMethod": location[methodName]
        };

        createHook(data);
        hooks.push(data);

    };

    _extra.removeHook = function (location, methodName, hookMethod) {

        var data;

        for (var i = 0; i < hooks.length; i += 1) {
            data = hooks[i];

            if (data.location === location &&
                data.methodName === methodName &&
                data.hookMethod === hookMethod) {

                hooks.splice(i,1);
                destroyHook(data);
                return true;

            }

        }

        return false;

    };

});