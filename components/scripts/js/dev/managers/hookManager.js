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


    function createHook(location, methodName, hookMethod) {

        var data = {
            "location": location,
            "methodName": methodName,
            "hookMethod": hookMethod,
            "originalMethod": location[methodName]
        };

        data.location[data.methodName] = function () {


            var returnValue,
                applyObject = arguments;

            if (data.callHookBeforeOriginal) {

                returnValue = data.hookMethod.apply(this, arguments);

                if (_extra.w.Object.prototype.toString.call( returnValue ) === '[object Arguments]') {
                    applyObject = returnValue;
                } else if (returnValue !== undefined) {
                    return returnValue;
                }

                return data.originalMethod.apply(this, applyObject);

            } else {

                returnValue = data.originalMethod.apply(this, applyObject);
                data.hookMethod.apply(this, arguments);
                return returnValue;

            }


        };

        hooks.push(data);

        return data;
    }

    function destroyHook(data) {
        data.location[data.methodName] = data.originalMethod;
    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// PUBLIC FUNCTIONS
    ///////////////////////////////////////////////////////////////////////



    _extra.addHookAfter = function (location, methodName, hookMethod) {


        var data = createHook(location, methodName, hookMethod);

        data.callHookBeforeOriginal = false;


    };

    _extra.addHookBefore = function (location, methodName, hookMethod) {

        var data = createHook(location, methodName, hookMethod);

        data.callHookBeforeOriginal = true;

    };

    // Same behaviour as after.
    _extra.addHook = _extra.addHookAfter;

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