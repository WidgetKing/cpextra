/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/11/15
 * Time: 7:39 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("EventDispatcher", function () {

    "use strict";

    function EventDispatcher() {

        var listeners = {};

        this.addEventListener = function (event, handler) {

            if (typeof handler === "function") {

                if (!listeners[event]) {

                    listeners[event] = [];

                }

                listeners[event].push(handler);

            } else {

                _extra.error("Tried to pass something into addEventListener as a handler which was not a function but" +
                        "rather of '" + typeof handler + "' type.");

            }


        };

        this.removeEventListener = function (event, handler) {

            var eventListeners = listeners[event];

            if (eventListeners) {

                for (var i = 0; i < eventListeners.length; i += 1) {

                    if (eventListeners[i] === handler) {

                        eventListeners.splice(i,1);
                        return true;

                    }

                }

            }

            return false;

        };

        this.hasEventListener = function (event, handler) {

            var eventListeners = listeners[event];

            if (!handler || !eventListeners) {

                return listeners.hasOwnProperty(event);

            } else {

                for (var i = 0; i < eventListeners.length; i += 1) {

                    if (eventListeners[i] === handler) {

                        return true;

                    }

                }

                // If we have gotten out of the loop without finding a match, then this must be false.
                return false;
            }

        };

        this.dispatchEvent = function (event) {

            var eventListeners = listeners[event.type];

            if (eventListeners) {

                for (var i = 0; i < eventListeners.length; i += 1) {

                    eventListeners[i](event);

                }

            }

        };



    }

    _extra.registerClass("EventDispatcher", EventDispatcher);


});