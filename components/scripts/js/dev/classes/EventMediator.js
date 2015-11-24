/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 4/11/15
 * Time: 3:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("EventMediator", function () {

    "use strict";

    function EventMediator() {

        ///////////////////////////////////////////////////////////////////////
        /////////////// PRIVATE VARIABLES
        ///////////////////////////////////////////////////////////////////////
        var events = {},
            // convert arguments from Object to Array.
            listeners = Array.prototype.slice.call(arguments),
            primaryHandlers = {},
            onEmptyCallback,
            doubleClickHandler = new _extra.classes.DoubleClickHandler();




        ///////////////////////////////////////////////////////////////////////
        /////////////// PRIVATE METHODS
        ///////////////////////////////////////////////////////////////////////
        function checkIfEmpty() {
            if (onEmptyCallback && listeners.length <= 0 && _extra.w.Object.keys(events).length <= 0) {
                onEmptyCallback();
            }
        }

        function hasMatchingEventData(event, interactiveObject, criteria) {

            var eventDataStore = events[event],
                data;

            if (!eventDataStore) {
                return false;
            }

            for (var i = 0; i < eventDataStore.length; i += 1) {
                data = eventDataStore[i];

                if (data.isInteractiveObjectCallback) {

                    if (data.interactiveObject === interactiveObject && data.criteria === criteria) {
                        // We have found an event with the exact same information.
                        return {
                            "index":i,
                            "data": data
                        };
                    }

                } else {

                    if (data.callback === interactiveObject) {

                        return {
                            "index":i,
                            "data": data
                        };

                    }

                }

            }

            return false;
        }

        function writeEventData(event, interactiveObject, criteria) {


            var data;

            // If we haven't created data for this event before, then we'll do that now.
            if (!events[event]) {

                // Create array for our data module
                var eventHandlersArray = [],
                    primaryHandler;
                events[event] = eventHandlersArray;

                // Create the single function that will be added as an event listener.
                // This function will call all the others.
                // It is handled in this manner to allow the double click manager to delay certain mouse events.
                primaryHandler = function(event) {

                    for (var i = 0; i < eventHandlersArray.length; i += 1) {

                        eventHandlersArray[i].callback(event);

                    }

                };

                // Let the double click handler check if this is an event it needs to manage.
                // If it is it will wrap the primary handler in another callback.
                primaryHandler = doubleClickHandler.addEventHandler(event, primaryHandler);

                primaryHandlers[event] = primaryHandler;

                // Add the event listener.
                loopAdd(listeners, event, primaryHandler);
            }




            if (hasMatchingEventData(event, interactiveObject, criteria)) {

                // We already have a listener for this exact event with this exact callback. No need to add another.
                return false;

            } else {

                // This is a new event, we need to create new data!

                // This listener is to call a function
                if (!criteria) {
                    data = {
                        "isInteractiveObjectCallback": false,
                        "callback":interactiveObject
                    };

                // This listener is to call an interactive object action.
                } else {

                    data = {
                        "isInteractiveObjectCallback":true,
                        "interactiveObject":interactiveObject,
                        "criteria":criteria,
                        "callback":function() {
                            _extra.actionManager.callActionOn(interactiveObject, criteria);
                        }
                    };
                }

                // Add this data to the store.
                events[event].push(data);

                return data;

            }

        }



        function removeEventData(event, interactiveObject, criteria) {

            var data = hasMatchingEventData(event, interactiveObject, criteria);

            if (data) {

                var eventCallbacksArray = events[event];
                eventCallbacksArray.splice(data.index,1);

                // If there are no more listeners for this event, then we'll delete this array.
                if (eventCallbacksArray.length <= 0) {

                    delete events[event];
                    loopRemove(listeners, event, primaryHandlers[event]);
                    doubleClickHandler.removeEventHandler(event);
                    delete primaryHandlers[event];

                    // If after deleting this array, we have no more listeners, and no more event callbacks
                    // we are empty and need to call onEmptyCallback
                    checkIfEmpty();

                }

                return data.data;

            }

            return false;

        }

        function loopAdd(a, event, callback) {
            for (var i = 0; i < a.length; i += 1) {

                a[i].addEventListener(event, callback);

            }
        }

        function loopRemove(a, event, callback) {
            for (var i = 0; i < a.length; i += 1) {

                a[i].removeEventListener(event, callback);

            }
        }

        function changeListeners(args,removePrevious) {
            var eventHandler,
                newListeners = Array.prototype.slice.call(args);

            // Check if we were passed 'null'. If so, we should change it to an empty array.
            if (newListeners.length === 1 && newListeners[0] === null) {
                newListeners = [];
            }

            for (var eventName in primaryHandlers) {
                if (primaryHandlers.hasOwnProperty(eventName)) {

                    // Looping through all the events we have listeners for.
                    eventHandler = primaryHandlers[eventName];

                    if (removePrevious) {
                        loopRemove(listeners, eventName, eventHandler);
                    }

                    loopAdd(newListeners, eventName, eventHandler);

                }
            }

            if (removePrevious) {
                listeners = newListeners;

                // If we have no listeners now. Then we may be empty
                checkIfEmpty();
            } else {
                listeners = listeners.concat(newListeners);
            }
        }

        function correctEventNameErrors (event) {

            switch (event) {
                case "doubleclick" :
                    return "dblclick";

                case "rollover" :
                    return "mouseover";

                case "rollout":
                    return "mouseout";

                default :
                    return event;
            }

        }


        ///////////////////////////////////////////////////////////////////////
        /////////////// PUBLIC METHODS
        ///////////////////////////////////////////////////////////////////////

        this.addEventListener = function (event, interactiveObject, criteria) {

            event = correctEventNameErrors(event);

            writeEventData(event, interactiveObject, criteria);

        };

        this.removeEventListener = function (event, interactiveObject, criteria) {

            event = correctEventNameErrors(event);

            removeEventData(event, interactiveObject, criteria);

        };

        this.hasEventListener = function (event, interactiveObject, criteria) {
            return hasMatchingEventData(event, interactiveObject, criteria) !== false;
        };

        this.dispatchEvent = function (event) {

            var eventObject;

            // If we have been passed a string...
            if (typeof event === "string") {

                eventObject = _extra.createEvent(event);

            // If we have been passed an event
            } else if (event.type !== undefined) {

                eventObject = event;
                event = eventObject.type;

            }


            if (primaryHandlers[event]) {

                // Possible need to create some event data here to pass into the handler.
                primaryHandlers[event](eventObject);
            }
        };

        /**
         * Exchanges the listener object for this mediator with another set of listner objects.
         * @param newListeners
         */
        this.swap = function() {

            changeListeners(arguments, true);

        };

        /**
         * Adds new listner objects for the events handled by this mediator.
         * @param newListeners
         */
        this.add = function() {

            changeListeners(arguments, false);

        };

        this.registerOnEmptyCallback = function (callback) {
            onEmptyCallback = callback;
        };

    }

    _extra.registerClass("EventMediator", EventMediator);

});