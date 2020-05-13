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
            that = this,
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

        function writeEventData(eventName, interactiveObject, criteria) {

            var data;
            // If we haven't created data for this event before, then we'll do that now.
            if (!events[eventName]) {

                // Create array for our data module
                var eventHandlersArray = [],
                    primaryHandler;
                events[eventName] = eventHandlersArray;

                // Create the single function that will be added as an event listener.
                // This function will call all the others.
                // It is handled in this manner to allow the double click manager to delay certain mouse events.
                primaryHandler = function(eventObject) {

                    // It's possible as we call these callbacks, they may cause event listeners to be removed.
                    // Therefore we'll go through this backward.
                    // However, because we use unshift() to add event listeners to the array, they are still
                    // executed in the order they were added.
                    var eventData;
                    for (var i = eventHandlersArray.length - 1; i >= 0; i -= 1) {

                        eventData = eventHandlersArray[i];

                        // If more than one event listener is removed while executing this callback, then it's possible
                        // we'll iterate over the same listener twice.
                        // The 'called' parameter stops that from happening.
                        if (!eventData.called) {

                            // If we have an id, then we want to set the xinfoEventTarget variable
                            if (that.id) {
                                _extra.eventManager.setEventTarget(that.id);
                            }

                            eventData.callback(eventObject);
                            eventData.called = true;

                        }

                    }



                    for (i = eventHandlersArray.length - 1; i >= 0; i -= 1) {

                        // Delete the called parameter so it won't interrupt behaviour of the next dispatched event.
                        delete eventHandlersArray[i].called;

                    }

                };

                // Let the double click handler check if this is an event it needs to manage.
                // If it is it will wrap the primary handler in another callback.
                primaryHandler = doubleClickHandler.addEventHandler(eventName, primaryHandler);

                primaryHandlers[eventName] = primaryHandler;

                // Add the event listener.
                loopAdd(listeners, eventName, primaryHandler);
            }




            if (hasMatchingEventData(eventName, interactiveObject, criteria)) {

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
                // We add it to the beginning of the array, because later we're going to be iterating backwards through
                // the array, but we still want handlers to be called in the order they were added.
                events[eventName].unshift(data);

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
            if (newListeners.length === 1 && (newListeners[0] === null || newListeners[0] === undefined)) {
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
                    return _extra.eventManager.events.DOUBLE_CLICK;

                case "rollover" :
                    return _extra.eventManager.events.MOUSE_OVER;

                case "rollout":
                    return _extra.eventManager.events.MOUSE_OUT;

				// case "click":
				// 	return "touchcancel";

                default :
                    return event;
            }

        }


        ///////////////////////////////////////////////////////////////////////
        /////////////// PUBLIC METHODS
        ///////////////////////////////////////////////////////////////////////

        this.setId = function (id) {
            this._id = id;
        };

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

    EventMediator.prototype = {
        get id(){
            return this._id;
        }
    };

    _extra.registerClass("EventMediator", EventMediator);

});
