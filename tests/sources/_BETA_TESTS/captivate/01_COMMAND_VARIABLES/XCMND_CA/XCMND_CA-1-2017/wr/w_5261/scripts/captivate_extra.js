/*
 * Copyright (c) 2015 Tristan Ward
 * ALL RIGHTS RESERVED
 *
 * This is part of a paid piece of software. It may not be used in any kind of project without a license granted by
 * the copyright holder or a company approved by the copyright holder.
 *
 * You may not redistribute, repackage, or resell this code, nor may you pass it off as your own creation.
 *
 */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////////////////// EXTRA INITIALIZATION
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function initExtra(topWindow) {

    "use strict";

    if (!topWindow) {
        topWindow = window;
    }

    // We do not automatically initiate Extra, because we might be running unit tests.
    // If the unit tests already define '_extra' then we'll skip over defining it to allow the unit tests to collect all
    // the data for the different modules.
    if (window._extra === undefined) {
        window._extra = {};
    } else {
        return;
    }

    ///////////////////////////////////
    ///////// Private Methods
    ///////////////////////////////////
    /**
     * Sends a message to the debug console of the browser, assuming the console is available.
     * @param message
     */
    _extra.log = function (message) {

        if (_extra.debugging) {

            _extra.debugging.log(message);

        } else if (_extra.console) {

            _extra.console.log(message);

        }
        //alert(message);
    };


    /**
     * Send an error to the debug console of the browser, assuming the console is available.
     * @param message
     */
    _extra.error = function (message) {

        if (_extra.debugging) {

            _extra.debugging.error(message);

        } else if (_extra.console) {

            _extra.console.error(message);

        }

    };

    // The highest window, where we should be able to find the internal functions of the output
    _extra.w = topWindow.parent;
    _extra.console = _extra.w.console;

    // Constants used to identify modules that are specialized for Captivate or Storyline
    _extra.CAPTIVATE = "captivate";
    _extra.STORYLINE = "storyline";


    //////////////
    ///// Extra Pre-detection
    //////////////
    if (_extra.w.X !== undefined) {

        _extra.aborted = true;

        _extra.registerModule = function () {
            // Purposefully left blank as we don't want to do anything with the registered modules.
        };

        _extra.log("Aborted initializing Extra for a second time, as we have detected the window.X property has already been defined.");

        return;
    } else {
        _extra.aborted = false;
    }

    //////////////
    ///// Class registry
    //////////////
    // Who would want extra classes?
    _extra.classes = {};

    _extra.registerClass = function (className, classConstructor, SuperClass) {

        if (SuperClass === _extra.STORYLINE || SuperClass === _extra.CAPTIVATE) {
            // In this case, this is the class registering that it is an impementation for a certain software.
            // Rather than saying it wants to extend the 'storyline' class.
            SuperClass = null;
        }

        if (SuperClass) {

            if (typeof SuperClass === "string") {


                if (_extra.classes[SuperClass]) {

                    SuperClass = _extra.classes[SuperClass];

                } else {

                    throw new Error("Could not find a class by the name of '" + SuperClass + "' to be used as a super class.");

                }

            }

            if (SuperClass.constructor === Function) {

                // Normal Inheritance
                classConstructor.prototype = new SuperClass;
                classConstructor.prototype.constructor = classConstructor;
                classConstructor.prototype.parent = SuperClass.prototype;

            }
            else
            {

                // Pure Virtual Inheritance
                classConstructor.prototype = SuperClass;
                classConstructor.prototype.constructor = classConstructor;
                classConstructor.prototype.parent = SuperClass;

            }
        }


        _extra.classes[className] = classConstructor;
    };

    //////////////
    ///// Module Registry
    //////////////
    var moduleRegistry = {};

    _extra.registerModule = function (moduleName, moduleDependencies, moduleConstructor) {

        var registry,
            dependency,
            dependencyRegistry,
            areDependenciesSetUp = true;

        function createRegistry(name) {
            moduleRegistry[name] = {
                "subordinates":{},
                "instantiated": false
            };
            return moduleRegistry[name];
        }

        function registerSubordinate(moduleName,subordinateName) {
            moduleRegistry[moduleName].subordinates[subordinateName] = moduleRegistry[subordinateName];
            areDependenciesSetUp = false;
        }

        // If the short hand has been used which passes in a module with no dependencies,
        // account for that case.
        if (typeof moduleDependencies === "function") {
            moduleConstructor = moduleDependencies;
            moduleDependencies = [];

        // If a single dependency has been passed in as a string rather than an array.
        } else if (typeof moduleDependencies === "string") {
            moduleDependencies = [moduleDependencies];
        }

        // If an object for this module has not been created, create that module.
        if (!moduleRegistry[moduleName]) {
            createRegistry(moduleName);
        // If a module of this name has already been created, it may have been to record its subordinates
        // On the other hand, if a contructor or dependencies parameter has been defined, another module
        // has already reserved this module name. This can be caused if some storyline code gets included with
        // the captivate export. Or visa versa
        } else if (moduleRegistry[moduleName].dependencies !== undefined) {
            throw Error("Tried to register two modules under the name: " + moduleName);
        }

        registry = moduleRegistry[moduleName];
        registry.dependencies = moduleDependencies;
        registry.moduleConstructor = moduleConstructor;

        // Loop through the dependencies to see if they have already been called.
        for (var i = 0; i < registry.dependencies.length; i += 1) {


            dependency = registry.dependencies[i];
            dependencyRegistry = moduleRegistry[dependency];

            // Make sure we're not making this module depend on itself
            if (dependency === moduleName) {
                throw new Error("Can't set up a module as a dependency of itself");
            }

            // The dependency module has already registered
            if (dependencyRegistry) {

                // But the dependency module hasn't been called yet.
                if (!dependencyRegistry.instantiated) {
                    // Leave a note with the dependency module to try and call us once he's done.
                    registerSubordinate(dependency,moduleName);
                }

            } else {

                dependencyRegistry = createRegistry(dependency);
                registerSubordinate(dependency,moduleName);

            }
        }

        if (areDependenciesSetUp) {

            initializeModule(moduleName);
        }

    };

    function initializeModule(moduleName) {
        var registry = moduleRegistry[moduleName],
            subDep,
            areAllDependenciesInitialized;


        registry.onLoadCallback = registry.moduleConstructor();
        registry.instantiated = true;

        // Loop through all the modules that have dependencies on this one
        for (var subordinateName in registry.subordinates) {
            if (registry.subordinates.hasOwnProperty(subordinateName)) {


                subDep = moduleRegistry[subordinateName];

                // If through another tree we've already initialized this module, then don't do it again.
                if (subDep.instantiated) {
                    continue;
                }

                // If this gets set to false, then we won't initialize this model.
                areAllDependenciesInitialized = true;


                for (var i = 0; i < subDep.dependencies.length; i += 1) {

                    if (!moduleRegistry[subDep.dependencies[i]].instantiated) {
                        areAllDependenciesInitialized = false;
                        break;
                    }

                }


                if (areAllDependenciesInitialized) {
                    initializeModule(subordinateName);
                }

            }
        }
    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// Get jQuery
    ///////////////////////////////////////////////////////////////////////

    _extra.$ = _extra.w.$;

    ///////////////////////////////////////////////////////////////////////
    /////////////// Define the public API
    ///////////////////////////////////////////////////////////////////////
    _extra.X = {
        "version":"0.0.2",
        "build":"3157"
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// On Load Callbacks
    ///////////////////////////////////////////////////////////////////////
    function callOnLoadCallbacks() {

        var m;
        for (var moduleName in moduleRegistry) {
            if (moduleRegistry.hasOwnProperty(moduleName)) {
                m = moduleRegistry[moduleName];
                if (m.onLoadCallback) {

                    try {
                        m.onLoadCallback();
                    } catch (e) {
                        _extra.error("Encountered error at module: " + moduleName + "/nDetails: /n" + e);
                    }

                }
            }
        }
    }


    ///////////////////////////////////////////////////////////////////////
    /////////////// Initialization
    ///////////////////////////////////////////////////////////////////////
    //////////////
    ///// Listen for Storyline Initialization

    var onStorylineLoaded = function () {

        window.removeEventListener("load", onStorylineLoaded);

        // It's possible this will be called in some unit tests. Generally we don't want
        // this to be called, so we'll check the '_extra' variable to make sure we're not
        // in a unit test.
        // Should really look into an 'unload' method to stop this.
        if (window.hasOwnProperty("_extra") && _extra.w.story) {

            callOnLoadCallbacks();

        }

    };


    window.addEventListener("load", onStorylineLoaded);

    //////////////
    ///// Listen for Captivate Initialization

    window.CaptivateExtraWidgetInit = function() {
        // Double check that we are actually in Captivate.
        if (_extra.w.cp) {
            // Stop listening for Storyline initialization.
            window.removeEventListener("load", onStorylineLoaded);
            callOnLoadCallbacks();
        }
    };
}

initExtra();
/* global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 1:53 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("Callback", function () {
    "use strict";


    _extra.registerClass("Callback", function () {

        this.data = {};
        this.addCallback = function (index, callback) {
            if (!this.data[index]) {
                this.data[index] = [];
            }
            this.data[index].push(callback);
        };
        this.hasCallbackFor = function (index) {
            return this.data[index] !== undefined;
        };
        this.sendToCallback = function (index,parameter) {
            if (this.data[index]) {
                var a = this.data[index];
                for (var i = 0; i < a.length; i += 1) {
                    a[i](parameter);
                }
            }
        };
        this.forEach = function (method) {

            var a;

            for (var index in this.data) {
                if (this.data.hasOwnProperty(index)) {

                    a = this.data[index];
                    for (var i = 0; i < a.length; i += 1) {
                        method(index,a[i]);
                    }

                }
            }
        };

        this.removeCallback = function (index,callbackToRemove) {
            if (this.data[index]) {
                var a = this.data[index],
                    registeredCallback;
                for (var i = 0; i < a.length; i += 1) {
                    registeredCallback = a[i];
                    if (callbackToRemove === registeredCallback) {
                        a.splice(i,1);

                        // If we have just deleted the last callback for this index, then we'll delete the array so that
                        // hasCallbackFor() will be able to respond accurately.
                        if (a.length <= 0) {
                            delete this.data[index];
                        }
                        break;
                    }

                }
            }
        };
        this.clear = function () {
            this.data = {};
        };

    });
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 2:29 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("DoubleClickHandler", function () {

    "use strict";

    ///////////// This class assumes only one click handler and one double click handler
    ///////////// EventMediator should ensure only one callback is sent here for those times of functions.
    function DoubleClickHandler() {

        ///////////////////////////////////////////////////////////////////////
        /////////////// PRIVATE VARIABLES
        ///////////////////////////////////////////////////////////////////////
        var activeTimeoutId,
            singleClickCount = 0,
            singleClickCallback,
            doubleClickCallback;


        ///////////////////////////////////////////////////////////////////////
        /////////////// PRIVATE FUNCTIONS
        ///////////////////////////////////////////////////////////////////////
        function singleClickHandler() {

            if (singleClickCallback) {

                // No need to delay the callback
                if (_extra.preferences.doubleClickDelay <= 0 || !doubleClickCallback) {

                    singleClickCallback();

                } else {

                    singleClickCount += 1;

                    if (!activeTimeoutId) {

                        // This is the FIRST click.

                        // We need to delay the callback to ensure this is a click and not the early
                        // signs of a double click
                        activeTimeoutId = setTimeout(function () {

                            if (singleClickCount >= 2) {

                                // We were clicked twice during the period, even though that didn't cause a double-click
                                doubleClickCallback();

                            } else {

                                // Enough time has passed since the first click and there has been no second click
                                // We can call the callback safely
                                singleClickCallback();

                            }

                            // Reset
                            singleClickCount = 0;
                            activeTimeoutId = null;

                        }, _extra.preferences.doubleClickDelay);


                    }

                    // If a second single click comes through here while the timeout is active we will record it.

                }


            }


        }

        function doubleClickHandler() {

            if (doubleClickCallback) {

                if (activeTimeoutId) {

                    clearTimeout(activeTimeoutId);
                    activeTimeoutId = null;
                    singleClickCount = 0;

                }

                doubleClickCallback();

            }

        }

        ///////////////////////////////////////////////////////////////////////
        /////////////// PUBLIC FUNCTIONS
        ///////////////////////////////////////////////////////////////////////

        this.addEventHandler = function(event, callback) {

            if (event === "click") {

                singleClickCallback = callback;
                return singleClickHandler;

            } else if (event === "dblclick") {

                doubleClickCallback = callback;

                return doubleClickHandler;

            }

            // If we get here, then the event is not dealing with something important to us.
            // Return the default callback.
            return callback;

        };

        this.removeEventHandler = function(event) {

            if (event === "click") {

                singleClickCallback = null;

            } else if (event === "dblclick") {

                doubleClickCallback = null;

            }

        };

    }

    _extra.registerClass("DoubleClickHandler", DoubleClickHandler);

});
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
            if (onEmptyCallback && listeners.length <= 0 && Object.keys(events).length <= 0) {
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
                primaryHandler = function() {

                    for (var i = 0; i < eventHandlersArray.length; i += 1) {

                        eventHandlersArray[i].callback();

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
            if (primaryHandlers[event]) {
                // Possible need to create some event data here to pass into the handler.
                primaryHandlers[event]();
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
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 29/10/15
 * Time: 2:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("Model", function () {

    "use strict";

    function Model() {

        var m = {},
            callback = new _extra.classes.Callback();

        this.updateCallback = callback;

        function notifyCallback(son,p,pv,v) {

            var callbackData = {
                "slideObjectName":son,
                "property":p,
                "previousValue":pv,
                "currentValue":v
            };


            callback.sendToCallback("*",callbackData);
            callback.sendToCallback(son,callbackData);
        }

        this.write = function (slideObjectName, property, value) {

            var objectData,
                previousValue;

            // If this is the first time we've written to this object...
            if (!m[slideObjectName]) {
                m[slideObjectName] = {};
            }

            objectData = m[slideObjectName];
            previousValue = objectData[property];


            // If the value has changed, then we'll update the model and inform the callbacks.
            if (previousValue !== value) {

                // UPDATE MODEL
                objectData[property] = value;

                notifyCallback(slideObjectName, property, previousValue, value);


            }
        };


        this.retrieve = function (slideObjectName, property) {
            if (property && m[slideObjectName]) {

                return m[slideObjectName][property];

            } else {

                return m[slideObjectName];

            }
        };

        this.hasDataFor = function (slideObjectName) {
            return m.hasOwnProperty(slideObjectName);
        };

        this.update = function (slideObjectName) {
            var objectData = m[slideObjectName],
                value;

            if (objectData) {

                for (var property in objectData) {
                    if (objectData.hasOwnProperty(property)) {

                        value = objectData[property];

                        notifyCallback(slideObjectName,property,value,value);

                    }
                }

            }

        };


    }

    _extra.registerClass("Model", Model);

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 29/10/15
 * Time: 1:54 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("ModelListener", function () {

    "use strict";

    function ModelListener(name, model) {

        ///////////////////////////////////////////////////////////////////////
        /////////////// Variables
        ///////////////////////////////////////////////////////////////////////
        ////////////////////////////////
        ////////// Private
        var properties = {};

        ////////////////////////////////
        ////////// Public
        this.model = model;

        ///////////////////////////////////////////////////////////////////////
        /////////////// Public Methods
        ///////////////////////////////////////////////////////////////////////
        this.addProperty = function (propertyName, onChangeCallback, defaultValue) {

            var dataBaseValue = model.retrieve(name,propertyName);

            properties[propertyName] = {
                "onChangeCallback":onChangeCallback,
                "defaultValue":defaultValue
            };

            if (dataBaseValue === undefined && defaultValue) {

                // If this has not been set previously, then we'll write its default value.
                model.write(name,propertyName,defaultValue);
                dataBaseValue = defaultValue;

            }

            if (dataBaseValue) {
                onChangeCallback(null, dataBaseValue);
            }
        };

        this.unload = function () {
            properties = null;
            model.updateCallback.removeCallback(name, onModelUpdate);
            model = null;
            this.model = null;
        };




        ///////////////////////////////////////////////////////////////////////
        /////////////// On Model Update
        ///////////////////////////////////////////////////////////////////////
        function onModelUpdate(data) {

            if (properties[data.property]) {

                properties[data.property].onChangeCallback(data.previousValue, data.currentValue);

            }

        }

        model.updateCallback.addCallback(name, onModelUpdate);


    }



    _extra.registerClass("ModelListener", ModelListener);

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 26/10/15
 * Time: 3:56 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("SlideObjectStateManager", function () {

    "use strict";

    function SlideObjectStateManager (slideObject, data) {


        var that = this,
            isMouseOver = false,
            isMouseDown = false,
            previousNormalState = slideObject.state;

        this.slideObject = slideObject;
        this.data = data;






        ///////////////////////////////////////////////////////////////////////
        /////////////// Util Methods
        ///////////////////////////////////////////////////////////////////////
        function isManagedState(stateName) {

            var mouseEventDetails,
                managedStateName;

            for (var mouseEvent in data) {
                if (data.hasOwnProperty(mouseEvent)) {

                    mouseEventDetails = data[mouseEvent];
                    for (managedStateName in mouseEventDetails) {
                        if (mouseEventDetails.hasOwnProperty(managedStateName) &&
                            managedStateName === stateName) {

                            return true;

                        }
                    }

                }
            }

            return false;
        }

        function doVariableValueComparison(variableValue, intendedValue) {
            if (typeof variableValue !== "boolean" && !isNaN(variableValue)) {
                variableValue = parseFloat(variableValue);
            } else if (variableValue === "false") {
                variableValue = false;
            }
            // I know here I use '!=' instead of '!==' but that is intentional as I want false == 0
            return variableValue == intendedValue;
        }


        ///////////////////////////////////////////////////////////////////////
        /////////////// State Inspection
        ///////////////////////////////////////////////////////////////////////
        function findStateWithValidVariables(shouldEvaluate, stateData) {

            // This shouldEvaluate calculation is done here instead of the proceeding function because it reduces
            // repetition.
            if (shouldEvaluate) {

                var variableData,
                    variableName,
                    isStateValid;

                // Loop through { r: { x_rollover... } }
                for (var stateName in stateData) {
                    if (stateData.hasOwnProperty(stateName)) {

                        variableData = stateData[stateName];
                        // We assume the state to be valid until we find proof that it's not.
                        // We need many variables to be true to work, and only one to be false to break it.
                        isStateValid = true;

                        // Loop through { r: { x_rollover: { variableName ... } }
                        for (variableName in variableData) {
                            if (variableData.hasOwnProperty(variableName)) {

                                if (!doVariableValueComparison(_extra.variableManager.getVariableValue(variableName),
                                                               variableData[variableName])) {

                                    isStateValid = false;
                                    break;

                                }

                            }
                        }

                        // If we have checked all the variables in this state as a NO.
                        if (isStateValid) {

                            slideObject.changeState(stateName);
                            return true;

                        }

                    }
                }

            }

            return false;
        }

        function evaluateState() {

            // Mouse down states take priority, even if there are valid rollover or normal states.
            if (!findStateWithValidVariables(isMouseDown, data.d)) {
                // Rollover states take priority over normal states.
                if (!findStateWithValidVariables(isMouseOver, data.r)) {

                    // Normal states have the lowest priority.
                    if (!findStateWithValidVariables(true, data.n)) {

                        slideObject.changeState(previousNormalState);

                    }

                }
            }

        }




        ///////////////////////////////////////////////////////////////////////
        /////////////// Event Listeners
        ///////////////////////////////////////////////////////////////////////
        ////////////////////////////////
        ////////// Mouse Over
        this.onRollover = function () {
            // Remove Listener
            slideObject.removeEventListener(_extra.eventManager.events.MOUSE_OVER, that.onRollover);
            // Update Information
            isMouseOver = true;
            // Change State
            evaluateState();
            // Listen for new mouse event
            slideObject.addEventListener(_extra.eventManager.events.MOUSE_OUT, that.onRollout);
        };

        this.onRollout = function () {

            slideObject.removeEventListener(_extra.eventManager.events.MOUSE_OUT, that.onRollout);
            isMouseOver = false;
            evaluateState();
            slideObject.addEventListener(_extra.eventManager.events.MOUSE_OVER, that.onRollover);

        };

        ////////////////////////////////
        ////////// Mouse Down
        this.onMouseDown = function () {

            slideObject.removeEventListener(_extra.eventManager.events.MOUSE_DOWN, that.onMouseDown);
            isMouseDown = true;
            evaluateState();
            _extra.w.document.addEventListener(_extra.eventManager.events.MOUSE_UP, that.onMouseUp);

        };

        this.onMouseUp = function () {

            _extra.w.document.removeEventListener(_extra.eventManager.events.MOUSE_UP, that.onMouseUp);
            isMouseDown = false;
            evaluateState();
            slideObject.addEventListener(_extra.eventManager.events.MOUSE_DOWN, that.onMouseDown);

        };

        ////////////////////////////////
        ////////// Start Listening
        if (data.r) {
            slideObject.addEventListener(_extra.eventManager.events.MOUSE_OVER, this.onRollover);
        }

        if (data.d) {
            slideObject.addEventListener(_extra.eventManager.events.MOUSE_DOWN, this.onMouseDown);
        }






        ///////////////////////////////////////////////////////////////////////
        /////////////// Manage finding the 'normal' state
        ///////////////////////////////////////////////////////////////////////
        this.onStateChangeCallback =  function (details) {
            // If this is not a state that we are automatically switching to...
            if (!isManagedState(details.stateName)) {
                // Then we should switch back to this state as the 'normal' state.
                previousNormalState = details.stateName;
            }
        };

        _extra.slideObjects.states.changeCallback.addCallback(slideObject.name, this.onStateChangeCallback);






        ///////////////////////////////////////////////////////////////////////
        /////////////// Manage listening for Variables changing
        ///////////////////////////////////////////////////////////////////////
        var eventName,
            eventData,
            stateName,
            variableData,
            variableName,
            variableListeners = {};

        // Looping through { r... d... n...}
        for (eventName in data) {
            if (data.hasOwnProperty(eventName)) {

                eventData = data[eventName];

                // Looping through { r: { x_over ... } }
                for (stateName in eventData) {
                    if (eventData.hasOwnProperty(stateName)) {

                        variableData = eventData[stateName];

                        // Looping through { r: { x_over : { variableName ... } } }
                        for (variableName in variableData) {
                            if (variableData.hasOwnProperty(variableName)) {

                                // If we're not already listening for this variable.
                                if (!variableListeners[variableName]) {

                                    _extra.variableManager.listenForVariableChange(variableName, evaluateState);
                                    // Mark this as true to avoid listening to this variable more than once.
                                    variableListeners[variableName] = true;

                                }

                            }
                        }

                    }
                }

            }
        }


        ////////////////////////////////
        ////////// KICK OFF!
        ///// Check to see if there are any states that are valid now.
        evaluateState();
        
    }

    SlideObjectStateManager.prototype.unload = function () {
        this.slideObject.removeEventListener(_extra.eventManager.events.MOUSE_OVER, this.onRollover);
        this.slideObject.removeEventListener(_extra.eventManager.events.MOUSE_OUT, this.onRollout);
        this.slideObject.removeEventListener(_extra.eventManager.events.MOUSE_DOWN, this.onMouseDown);
        _extra.w.document.removeEventListener(_extra.eventManager.events.MOUSE_UP, this.onMouseUp);

        _extra.slideObjects.states.changeCallback.removeCallback(this.slideObject.name, this.onStateChangeCallback);

        this.slideObject = null;
        this.data = null;
    };

    _extra.registerClass("SlideObjectStateManager", SlideObjectStateManager);
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 4:32 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("createSlideObjectData", ["factoryManager"], function () {
    "use strict";

    // We have not added requirements for each of the proxy classes as in theory this function would not be called until
    // onload time. However, if we do run into the case where we need to call this before then... Well... Bummer.

    _extra.factories.createSlideObjectData = function (name, data, type) {



        switch (type) {

            case _extra.dataTypes.slideObjects.TEXT_ENTRY_BOX :
                return new _extra.classes.TextEntryBoxDataProxy(name, data, type);

            default :
                return new _extra.classes.BaseSlideObjectDataProxy(name, data, type);

        }

    };
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 6:38 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("createSlideObjectProxy",["factoryManager"], function () {

    "use strict";

    _extra.factories.createSlideObjectProxy = function (id, element) {
        var data = _extra.dataManager.getSlideObjectDataByName(id);

        switch (data.type) {
            /*case _extra.dataTypes.slideObjects.TEXT_ENTRY_BOX :

                break;*/

            default :
                return new _extra.classes.BaseSlideObjectProxy(element, data);

        }
    };
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 4:26 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("factoryManager", function () {

    "use strict";

    _extra.factories = {

    };

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/11/15
 * Time: 9:33 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("debuggingManager", function () {

    "use strict";

    _extra.debugging = {

        "log":function (message) {

            if (_extra.preferences && _extra.preferences.debugMode) {

                _extra.w.alert(message);

            } else {

                _extra.console.log(message);

            }

        },
        "error":function (message) {

            if (_extra.preferences && _extra.preferences.debugMode) {

                _extra.w.alert(message);

            } else {

                _extra.console.error(message);

            }

        }

    };

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/11/15
 * Time: 4:03 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("actionManager",["softwareInterfacesManager"],function () {

    "use strict";

    _extra.actionManager = {

        "callActionOn": function (slideObject, callSuccessAction) {

            if (callSuccessAction === undefined) {

                callSuccessAction = true;

            // Interpret callSuccessAction
            } else if (typeof callSuccessAction === "string") {

                // If this is a string
                if (isNaN(callSuccessAction)) {

                    switch (callSuccessAction.toLowerCase()) {

                        case "correct":
                        case "success":
                            callSuccessAction = true;
                            break;

                        case "fail":
                        case "failure":
                            callSuccessAction = false;
                            break;

                        default :
                            _extra.error("Failed to call action on '" + slideObject +
                                         "' because can't interpret what criteria '" +
                                         callSuccessAction + "' represents.");
                            return;

                    }

                // If this is a number in disguise
                } else {
                    callSuccessAction = parseInt(callSuccessAction);
                }


            }

            var data = _extra.dataManager.getSlideObjectDataByName(slideObject),
                stringCode;

            if (data) {

                if (data.isInteractiveObject) {

                    if (callSuccessAction) {

                        stringCode = data.successAction;

                    } else {

                        stringCode = data.failureAction;

                    }

                } else {

                    _extra.error("Could not call action on '" + slideObject + "' as it is not an Interactive Object " +
                                 "(an object with success / failure criteria)");

                }

            } else {

                _extra.error("Tried to call an action on '" + slideObject +
                             "' but could not find any slide objects by that name");

            }

            // If by the end of this we have some valid javascript to call
            if (stringCode) {

                _extra.captivate.movie.executeAction(stringCode);

            }
        }

    };

}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/10/15
 * Time: 5:19 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("cssManager", function () {

    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// Create Extra's Styles
    ///////////////////////////////////////////////////////////////////////
    _extra.$("<style type='text/css'> .extra-mouse-disabled{ pointer-events: none; };</style>").appendTo("head");
    _extra.$("<style type='text/css'> .extra-hand-cursor{ cursor:pointer;  };</style>").appendTo("head");

    ///////////////////////////////////////////////////////////////////////
    /////////////// Create Methods
    ///////////////////////////////////////////////////////////////////////
    _extra.cssManager = {
        "addClassTo":function (element, className) {
            _extra.$(element).addClass(className);
        },
        "removeClassFrom":function (element, className) {
            _extra.$(element).removeClass(className);
        },
        "editCSSOn":function (element, property, value) {
            _extra.$(element).css(property, value);
        }
    };
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/10/15
 * Time: 4:13 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("eventManager", ["EventMediator", "EventDispatcher", "slideObjectProxyAutoInstantiator"], function () {
    "use strict";

    var eventMediators = {},
        isMobile = 'ontouchstart' in _extra.w.document.documentElement;

    _extra.eventManager = {

        "eventDispatcher": new _extra.classes.EventDispatcher(),

        "getEventMediator": function (slideObjectName) {

            if (!eventMediators[slideObjectName]) {

                var mediator = new _extra.classes.EventMediator();

                // Unload event mediator when it runs out of listeners
                mediator.registerOnEmptyCallback(function () {
                    delete eventMediators[slideObjectName];
                });

                eventMediators[slideObjectName] = mediator;
            }

            // Check if a slide object needs to be created
            _extra.slideObjects.proxyAutoInstantiator.check(slideObjectName);

            return eventMediators[slideObjectName];
        },
        "hasEventMediatorFor":function (slideObjectName) {
            return eventMediators.hasOwnProperty(slideObjectName);
        },
        "events": {
            "MOUSE_DOWN": (isMobile) ? "touchstart" : "mousedown",
            "MOUSE_UP": (isMobile) ? "touchend" : "mouseup",
            "MOUSE_MOVE": (isMobile) ? "touchmove" : "mousemove",
            "MOUSE_OVER": "mouseover",
            "MOUSE_OUT": "mouseout",
            "ROLLOVER": "mouseover",
            "ROLLOUT": "mouseout",
            "RIGHT_CLICK": "rightclick",
            "CLICK": "click",
            "DOUBLE_CLICK": "dblclick"
        }
    };

    // Ensure that if we have event data for a certain slide object, that a slide object proxy is created
    // for that object on entering its slide.
    _extra.slideObjects.proxyAutoInstantiator.registerModelLookup(_extra.eventManager.hasEventMediatorFor);

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 3:49 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("publicAPIManager", function () {
    "use strict";

    // We'll wait for everything to be defined before setting up the public API.
    return function () {
        _extra.w.X = _extra.X;

        _extra.X._ = _extra;
        _extra.X.getSlideData = _extra.slideManager.getSlideData;
        _extra.X.gotoSlide = _extra.slideManager.gotoSlide;
        _extra.X.getSlideObjectByName = _extra.slideObjects.getSlideObjectByName;
        _extra.X.hide = _extra.slideObjects.hide;
        _extra.X.show = _extra.slideObjects.show;
        _extra.X.disable = _extra.slideObjects.disable;
        _extra.X.enable = _extra.slideObjects.enable;
        _extra.X.changeState = _extra.slideObjects.states.change;
    };
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 4:14 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("BaseSlideObjectDataProxy", function () {
    "use strict";
    function BaseSlideObjectData(name, data, type) {

        // When registering this class it will be instantiated without any parameters which causes an error in
        // some of the following code.
        if (data) {

            this._name = name;
            this._data = data;
            this._type = type;

            this._key = this._data.base.mdi;
            this._initialStateData = _extra.captivate.api.getDisplayObjByKey(this._key);

        }
    }

    BaseSlideObjectData.prototype = {
        get name(){
            return this._name;
        },
        get data() {
            return this._data;
        },
        get type() {
            return this._type;
        },
        get uid() {
            return this._data.container.uid;
        },
        get states() {

            if (!this._states) {
                this._states = [];

                var rawStatesArray = this._data.base.stl;

                // Objects such as widgets do not have the stl property. So we check this is valid before continuing.
                if (rawStatesArray) {

                    for (var i = 0; i < rawStatesArray.length; i += 1) {

                        this._states.push(rawStatesArray[i].stn);

                    }

                }
            }

            return this._states;
        },
        get currentStateName() {
            if (this.states.length <= 0) {
                return "Normal";
            } else {
                return this.states[this._initialStateData.currentState];
            }
        },
        get isInteractiveObject() {
            return this._data.base.hasOwnProperty("oca");
        },
        get successAction() {
            return this._data.base.oca;
        },
        get failureAction() {
            return this._data.base.ofa;
        }
    };

    BaseSlideObjectData.prototype.getDataForState = function (stateName) {
        // If this is the first time we've called this method for this instance.
        if (!this._stateDatas) {

            // Define variables
            var stateDataProxy,
                stateDatas = {};
            // Set public variable so we can keep track of whether this is the first time or not.
            this._stateDatas = stateDatas;

            if (this._initialStateData.states.length <= 1) {

                // This object does not have any states.
                // So we have to fake the data.
                stateDatas[stateName] = new _extra.classes.StateDataProxy({
                    "stsi":[this.uid],
                    "stn":"Normal"
                });

            } else {

                // Loop through the state information
                this._initialStateData.states.forEach(function (rawStateData) {
                    stateDataProxy = new _extra.classes.StateDataProxy(rawStateData);
                    // Assign this data to the holder object.
                    stateDatas[stateDataProxy.name] = stateDataProxy;
                });

            }
        }

        return this._stateDatas[stateName];
    };

    _extra.registerClass("BaseSlideObjectDataProxy", BaseSlideObjectData);
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 7:07 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("BaseSlideObjectProxy", function () {

    "use strict";

    var ENABLE_FOR_MOUSE = "enableForMouse",
        CURSOR = "cursor",
        X = "x", Y = "y",
        WIDTH = "width",
        HEIGHT = "height";


    function BaseSlideObjectProxy(element, data) {




        ///////////////////////////////////////////////////////////////////////
        /////////////// Private Variables that are public because we can't get around it
        ///////////////////////////////////////////////////////////////////////
        this._data = data;
        this._model = _extra.slideObjects.model;
        this._currentStateData = data.getDataForState(this.state);
        this._offsetX = 0;
        this._offsetY = 0;


        ///////////////////////////////////////////////////////////////////////
        /////////////// Private Variables
        ///////////////////////////////////////////////////////////////////////
        var modelListener = new _extra.classes.ModelListener(this.name, this._model),
            that = this,
            eventMediator = _extra.eventManager.getEventMediator(this.name),
            originalX = this._currentStateData.originalX,
            originalY = this._currentStateData.originalY;

        eventMediator.swap(this._currentStateData);


        ///////////////////////////////////////////////////////////////////////
        /////////////// Public Methods
        ///////////////////////////////////////////////////////////////////////
        this.addEventListener = function (eventName, callback) {
            eventMediator.addEventListener(eventName, callback);
        };

        this.removeEventListener = function (eventName, callback) {
            eventMediator.removeEventListener(eventName, callback);
        };

        this.hasEventListener = function(eventName) {
            return eventMediator.hasEventListener(eventName);
        };

        this.enableForMouse = function() {
            modelListener.model.write(this.name, ENABLE_FOR_MOUSE, true);
        };

        this.disableForMouse = function() {
            modelListener.model.write(this.name, ENABLE_FOR_MOUSE, false);
        };

        this.setHandCursor = function(cursorType) {
            modelListener.model.write(this.name, CURSOR, cursorType);
        };

        this.unload = function () {
            eventMediator.swap(null);
            modelListener.unload();
            _extra.eventManager.eventDispatcher.removeEventListener("slideloaded", addModelListeners);
            _extra.slideObjects.states.changeCallback.removeCallback(that.name,onStateChange);
            that._currentStateData.removeOnDrawCallback(addModelListeners);
        };



        ///////////////////////////////////////////////////////////////////////
        /////////////// Internal Methods
        ///////////////////////////////////////////////////////////////////////
        ////////////////////////////////
        ////////// Manage State Changing

        function onStateChange(details) {

            var futureStateData = data.getDataForState(details.stateName);

            // Change the event listeners from the DOM elements of the previous state to the one of this state.
            eventMediator.swap(futureStateData);

            // Update the offset
            that._offsetX = originalX - futureStateData.originalX;
            that._offsetY = originalY - futureStateData.originalY;

            // Complete the transition
            that._currentStateData = futureStateData;

            // Update to model
            modelListener.model.update(that.name);

        }
        _extra.slideObjects.states.changeCallback.addCallback(this.name, onStateChange);



        ///////////////////////////////////////////////////////////////////////
        /////////////// MODEL LISTENER METHODS
        ///////////////////////////////////////////////////////////////////////

        function addModelListeners() {

            that._currentStateData.removeOnDrawCallback(addModelListeners);

            ////////////////////////////////
            ////////// Enable For Mouse
            modelListener.addProperty(ENABLE_FOR_MOUSE, function (previousValue, currentValue) {

                if (currentValue) {

                    // ENABLE
                    that._currentStateData.removeClass("extra-mouse-disabled");

                } else {

                    // DISABLE
                    that._currentStateData.addClass("extra-mouse-disabled");

                }

            });

            ////////////////////////////////
            ////////// Hand Cursor
            modelListener.addProperty(CURSOR, function (previousValue, currentValue) {

                that._currentStateData.editCSS("cursor", currentValue);

            });

            ////////////////////////////////
            ////////// X
            modelListener.addProperty(X, function (previousValue, currentValue) {

                that._currentStateData.x = currentValue - that._offsetX;

            });

            ////////////////////////////////
            ////////// Y
            modelListener.addProperty(Y, function (previousValue, currentValue) {

                that._currentStateData.y = currentValue - that._offsetY;

            });

            ////////////////////////////////
            ////////// Width
            modelListener.addProperty(WIDTH, function (previousValue, currentValue) {

                that._currentStateData.width = currentValue;

            });


            ////////////////////////////////
            ////////// Height
            modelListener.addProperty(HEIGHT, function (previousValue, currentValue) {

                that._currentStateData.width = currentValue;

            });

        }

        this._currentStateData.addOnDrawCallback(addModelListeners);


    }

    BaseSlideObjectProxy.prototype = {
        get name(){
            return this._data.name;
        },
        get data() {
            return this._data;
        },
        get type(){
            return this._data.type;
        },
        get state() {
            return this._data.currentStateName;
        },

        get x() {
            return this._currentStateData.x + this._offsetX;
        },
        set x(value) {
            this._model.write(this.name, X, value);
        },
        get y() {
            return this._currentStateData.y + this._offsetY;
        },
        set y(value) {
            this._model.write(this.name, Y, value);
        },

        get width() {
            return this._currentStateData.width;
        },
        get height() {
            return this._currentStateData.height;
        }


    };

    BaseSlideObjectProxy.prototype.changeState = function (stateName) {
        _extra.slideObjects.states.change(this.name, stateName);
    };

    _extra.registerClass("BaseSlideObjectProxy", BaseSlideObjectProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("SlideDataProxy", function () {

    "use strict";

    function SlideDataProxy(data) {
        this._data = data;
    }

    SlideDataProxy.prototype = {
        get name(){
            return this._data.base.lb;
        },
        get slideObjects(){

            // Only called once to initialize.
            if (!this._slideObjects) {

                this._slideObjects = [];

                // Raw Slide Objects List
                var rawSlideObjectList = this._data.base.si;

                for (var i = 0; i < rawSlideObjectList.length; i += 1) {

                    this._slideObjects.push(rawSlideObjectList[i].n);

                }

            }
            return this._slideObjects;
        },
        get id() {
            return this._data.container.dn;
        }
    };



    _extra.registerClass("SlideDataProxy", SlideDataProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/10/15
 * Time: 10:59 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("StateDataProxy",function () {

    "use strict";


    ///////////////////////////////////////////////////////////////////////
    /////////////// PRIVATE STATIC FUNCTIONS
    ///////////////////////////////////////////////////////////////////////
    function removePXSuffix(value) {
        if (value.substr(value.length - 2, 2) === "px") {
            value = value.substr(0,value.length - 2);
        }

        return parseFloat(value);
    }

    function doCSSPropertySet(value, offsetProperty, cssProperty, that) {

        var offset = that.primaryObject[offsetProperty];

        that.slideObjects.forEach(function (data) {

            var valueForSlideObject = value;
            valueForSlideObject -= offset - data[offsetProperty];
            valueForSlideObject = valueForSlideObject + "px";

            _extra.cssManager.editCSSOn(data.upperDIV, cssProperty, valueForSlideObject);
            _extra.cssManager.editCSSOn(data.contentDIV, cssProperty, valueForSlideObject);
        });

    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// CONSTRUCTOR
    ///////////////////////////////////////////////////////////////////////

    function StateDataProxy(data) {

        if (data) {

            this._data = data;
            this.slideObjects = [];

            ///////////////////////////////////////////////////////////////////////
            /////////////// PRIVATE VARIABLES
            ///////////////////////////////////////////////////////////////////////
            var tempData,
                onDrawCallbacks = [],
                rawDrawImageMethod,
                that = this,
                hasBeenDrawn = false;

            ///////////////////////////////////////////////////////////////////////
            /////////////// GET DATA
            ///////////////////////////////////////////////////////////////////////
            for (var i = 0; i < data.stsi.length; i += 1) {
                tempData = _extra.captivate.api.getDisplayObjByCP_UID(data.stsi[i]);
                this.slideObjects.push({
                    // Formatted Data for slideObject within state.
                    "upperDIV":tempData.actualParent,
                    "contentDIV":tempData.element.parentNode,
                    "originalX":tempData.bounds.minX,
                    "originalY":tempData.bounds.minY,
                    "originalWidth":tempData.bounds.maxX - tempData.bounds.minX,
                    "originalHeight":tempData.bounds.maxY - tempData.bounds.minY,
                    "canvasContext": tempData.element.getContext("2d"),
                    "name":tempData.divName,
                    "rawData":tempData
                });
            }

            this.primaryObject = this.slideObjects[0];


            ///////////////////////////////////////////////////////////////////////
            /////////////// ON DRAW IMAGE CALLBACKS
            ///////////////////////////////////////////////////////////////////////
            ////////////////////////////////
            ////////// Methods
            this.addOnDrawCallback = function (method) {
                onDrawCallbacks.push(method);
                if (hasBeenDrawn) {
                    _extra.log(that.primaryObject.name + " onDrawCallback called Immediately");
                    method();
                }
            };
            this.removeOnDrawCallback = function (method) {
                for (var i = 0; i < onDrawCallbacks.length; i += 1) {

                    if (onDrawCallbacks[i] === method) {

                        onDrawCallbacks.splice(i,1);

                    }

                }
            };

            ////////////////////////////////
            ////////// Setup
            rawDrawImageMethod = this.primaryObject.canvasContext.drawImage;
            // Hook into the function.
            this.primaryObject.canvasContext.drawImage = function () {

                var result = rawDrawImageMethod.apply(this, arguments);

                hasBeenDrawn = true;

                for (var i = 0; i < onDrawCallbacks.length; i += 1) {

                    onDrawCallbacks[i]();

                }

                return result;

            };

            ////////////////////////////////
            ////////// Detect if has already been drawn
            if (this.primaryObject.rawData.canvas) {
                hasBeenDrawn = true;
            }


        }
    }

    StateDataProxy.prototype = {
        get name() {
            return this._data.stn;
        },




        get x () {
            return removePXSuffix(this.primaryObject.upperDIV.style.left);
        },
        set x (value) {

            doCSSPropertySet(value, "originalX", "left", this);

        },


        get y () {
            return removePXSuffix(this.primaryObject.upperDIV.style.top);
        },
        set y (value) {

            doCSSPropertySet(value, "originalY", "top", this);

        },


        get width () {
            return removePXSuffix(this.primaryObject.upperDIV.style.width);
        },
        set width (value) {

            doCSSPropertySet(value, "originalWidth", "width", this);

        },


        get height () {
            return removePXSuffix(this.primaryObject.upperDIV.style.height);
        },
        set height (value) {

            doCSSPropertySet(value, "originalHeight", "height", this);

        },



        get originalX() {
            return this.primaryObject.originalX;
        },
        get originalY() {
            return this.primaryObject.originalY;
        }
    };

    StateDataProxy.prototype.addEventListener = function (eventName, callback) {
        this.slideObjects.forEach(function (data) {
            data.upperDIV.addEventListener(eventName, callback);
        });
    };

    StateDataProxy.prototype.removeEventListener = function (eventName, callback) {
        this.slideObjects.forEach(function (data) {
            data.upperDIV.removeEventListener(eventName, callback);
        });
    };

    StateDataProxy.prototype.setAttribute = function (property, value) {
        this.slideObjects.forEach(function (data) {
            data.upperDIV.setAttribute(property, value);
            data.contentDIV.setAttribute(property, value);
        });

    };

    StateDataProxy.prototype.addClass = function (className) {
        this.slideObjects.forEach(function (data) {
            _extra.cssManager.addClassTo(data.upperDIV, className);
            _extra.cssManager.addClassTo(data.contentDIV, className);
        });
    };

    StateDataProxy.prototype.removeClass = function(className) {
        this.slideObjects.forEach(function (data) {
            _extra.cssManager.removeClassFrom(data.upperDIV, className);
            _extra.cssManager.removeClassFrom(data.contentDIV, className);
        });
    };

    StateDataProxy.prototype.editCSS = function(property, value) {
        this.slideObjects.forEach(function (data) {
            _extra.cssManager.editCSSOn(data.upperDIV, property, value);
            _extra.cssManager.editCSSOn(data.contentDIV, property, value);
        });
    };

    _extra.registerClass("StateDataProxy", StateDataProxy);

}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 5:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("TextEntryBoxDataProxy", ["BaseSlideObjectDataProxy"], function () {
    "use strict";

    function TextEntryBoxDataProxy(name, data, type) {

        // Call super constructor
        _extra.classes.BaseSlideObjectDataProxy.call(this, name, data, type);

        this._isResponsive = typeof data.container.txt === "object";
    }


    _extra.registerClass("TextEntryBoxDataProxy", TextEntryBoxDataProxy, "BaseSlideObjectDataProxy", _extra.CAPTIVATE);

    Object.defineProperty(TextEntryBoxDataProxy.prototype,"variable", {
        get: function() {
            return this._data.base.vn;
        }
    });

    Object.defineProperty(TextEntryBoxDataProxy.prototype,"defaultText", {
        get: function() {
            if (this._isResponsive) {
                // TODO: Implement a way to find out what current breakpoint is active so that we can return the appropriate information.
                _extra.error("TextEntryBoxData.defaultText getter for Captivate responsive projects has yet to be implemented");
                return null;
            } else {
                return this._data.container.txt;
            }
        },
        set: function(value) {

            // In responsive projects this property will be set as an object to allow different default text according ot screen size.
            if (this._isResponsive) {
                for (var screenSize in this._data.container.txt) {
                    // Go through all the screen sizes and change its default value.
                    if (this._data.container.txt.hasOwnProperty(screenSize)) {
                        this._data.container.txt[screenSize] = value;
                    }
                }
            } else {
                // In a non responsive project this is much more direct.
                this._data.container.txt = value;
            }
        }
    });


}, _extra.CAPTIVATE);
/*global _extra*/
_extra.registerModule("generalDataManager", ["softwareInterfacesManager", "dataTypeConverters", "createSlideObjectData"], function () {

    "use strict";

    _extra.dataManager = {

        "getSlideObjectDataByName": function (name) {
            var data = {
                "base": _extra.captivate.allSlideObjectsData[name]
            };

            if (data.base) {
                data.container = _extra.captivate.allSlideObjectsData[name + "c"];
                return _extra.factories.createSlideObjectData(name, data, _extra.dataTypes.convertSlideObjectType(data.base.type));
            }
            return null;
        }
    };

    //_extra.log(_extra.dataManager.getSlideObjectDataByName("Text_Entry_Box_1"));
    /*_extra.m = _extra.X.cp.model;
    _extra.X._extra.captivate.allSlideObjectsData = _extra.m;

    _extra.dataManager = {};
    _extra.dataManager.projectSlideObjectData = _extra.m.data;


    return function () {

    };*/
}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/11/15
 * Time: 9:42 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("debuggingPreferenceManager", ["preferenceManager", "debuggingManager"], function () {

    "use strict";

    var preferenceModuleInfo = {



    };

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 1:03 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("doubleClickDelayPreference", ["preferenceManager"], function () {

    "use strict";

    // This is our preference
    // And this is the default value: 0
    // 0 means that we will not listen for double click delay.
    _extra.preferences.doubleClickDelay = 0;

    var preferenceModuleInfo = {
        "enable": function () {

            // This is called only once while validated.
            // We want to update every time the function updates.
            // This function has no content, but the preference manager will throw an error if it's not defined.

        },
        "update": function (value) {

            // If we haven't been given a number.
            if (typeof value !== "number") {

                if (isNaN(value)) {
                    preferenceModuleInfo.disable();
                    return;
                }
                value = parseFloat(value);
            }

            // Assign AND convert seconds to milliseconds
            _extra.preferences.doubleClickDelay = value * 1000;

        },
        "disable": function () {
            // Turn off.
            _extra.preferences.doubleClickDelay = 0;
        }
    };

    _extra.preferenceManager.registerPreferenceModule("DoubleClickDelay", preferenceModuleInfo);

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/10/15
 * Time: 5:06 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("preferenceManager", ["variableManager"], function () {

    "use strict";
    var preferenceVariablePrefix = "xpref";
    var preferenceModules = {};

    // This object will hold the settings for our project which are controlled by preference variables.
    _extra.preferences = {

    };

    _extra.preferenceManager = {

        /**
         * Takes information for a behaviour module and enables it at the appropriate time.
         *
         * A behaviour module is a part of Extra which has been built to change the default behaviour of the target software.
         *
         * Examples include, stopping TextEntryBoxes from being blank when they first appear, thereby preventing their variables
         * from losing their values needlessly.
         * @param preferenceVariableSuffix
         * @param preferenceInfo
         * @returns {boolean}
         */
            "registerPreferenceModule": function (preferenceVariableSuffix, preferenceInfo) {

            // What the name for the variable that manages this behaviour should look like.
            var preferenceVariable = preferenceVariablePrefix + preferenceVariableSuffix;

            function onPreferenceVariableChange () {

                var value = _extra.variableManager.getVariableValue(preferenceVariable);

                if (value) {

                    if (!preferenceInfo.enabled) {
                        preferenceInfo.enable(value);
                        preferenceInfo.enabled = true;
                    }

                    // If an update method has been provided, we'll call that with the value.
                    if (preferenceInfo.update) {
                        preferenceInfo.update(value);
                    }

                } else {

                    if (preferenceInfo.enabled) {
                        preferenceInfo.disable();
                        preferenceInfo.enabled = false;
                    }

                }
            }

            // Now check to see if a variable has been defined to manage this behaviour. If it has, then we will save this
            // behaviour.

            if (!_extra.variableManager.hasVariable(preferenceVariable)) {
                // Check to see if the behaviour variable has been defined with an underscore at the front of its name.
                preferenceVariable = "_" + preferenceVariable;
                if (!_extra.variableManager.hasVariable(preferenceVariable)) {
                    // Show the behaviour module that there is no variable defined to manage the behaviour and it is therefore
                    // unneccesary to instantiate.
                    return false;
                }
            }


            // Check validity of passed in information.
            if (preferenceModules[preferenceVariable]) {
                // We already have a behaviour module of this type.
                throw new Error("Illegally attempted to register two behaviour modules with the name: " + preferenceVariableSuffix);
            } else if (!preferenceInfo.enable) {
                throw new Error("Illegally tried to submit a behaviour module without an enable method specified in the preferenceInfo parameter object.");
            } else if (!preferenceInfo.disable) {
                throw new Error("Illegally tried to submit a behaviour module without a disable method specified in the preferenceInfo parameter object.");
            }

            // Save behaviour
            preferenceModules[preferenceVariable] = preferenceInfo;
            preferenceInfo.enabled = false;



            // Every time the behaviour variable changes, we'll make sure the module is enabled or disabled accordingly.
            _extra.variableManager.listenForVariableChange(preferenceVariable, onPreferenceVariableChange);

            // We'll also enable or disable
            onPreferenceVariableChange();

            // Let the module know there is a variable set up to manage the behaviour and it is therefore approved to
            // continue instantiation
            return true;

        }
    };

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 6:17 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("saveLocalStoragePreference", ["preferenceManager"], function () {

    "use strict";


    var info = {
        "enable": function () {

        },
        "update": function (value) {

            if (!value) {
                value = "";
            } else if (isNaN(value)) {
                value = value.toLowerCase();
            }

            // Stop whatever it was we were doing before.
            info.disable();



            switch (value) {

                case "onenterslide" :
                case "onslideenter" :

                        _extra.slideManager.enterSlideCallback.addCallback("*", _extra.variableManager.saveStorageVariables);

                    break;

                case "disable":
                case "disabled":
                case "off":
                case "no":

                        // Do nothing

                    break;

                // TODO: Add another 'onchange' type

                default :
                        //_extra.w.addEventListener("unload", _extra.variableManager.saveStorageVariables);
                        _extra.w.addEventListener("unload", _extra.variableManager.saveStorageVariables);
                    break;
            }
        },
        "disable": function () {

            _extra.slideManager.enterSlideCallback.removeCallback("*", _extra.variableManager.saveStorageVariables);
            _extra.w.removeEventListener("unload", _extra.variableManager.saveStorageVariables);

        }
    };

    var hasVariable = _extra.preferenceManager.registerPreferenceModule("SaveLocalStorage", info);

    if (!hasVariable) {

        // Default action
        info.enable();
        info.update();

    }

});
/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("preventTextEntryBoxOverwrite", ["slideObjectManager_global", "preferenceManager", "eventManager"], function () {
    "use strict";

    ///////////////////////
    ////////// Private Variables
    ///////////////////////

    var hasCollectedTextBoxData = false,
        textEntryBoxData = {},
        areVariablesInitliazed = false,
        behaviourModuleInfo = {
            // Automatically called by _extra.preferenceManager in response to the value of the xbehaviourPreventTextEntryBoxOverwrite variable
        "enable": function () {
            if (hasCollectedTextBoxData) {
                for (var textEntryBoxName in textEntryBoxData) {
                    if (textEntryBoxData.hasOwnProperty(textEntryBoxName)) {
                        enableVariable(textEntryBoxName);
                    }
                }
            }
        },
        "disable": function () {
            if (hasCollectedTextBoxData) {
                for (var textEntryBoxName in textEntryBoxData) {
                    if (textEntryBoxData.hasOwnProperty(textEntryBoxName)) {
                        disableVariable(textEntryBoxName);
                    }
                }
            }
        }
    };



    ///////////////////////
    ////////// Private Functions
    ///////////////////////

    function enableVariable(textEntryBoxName) {
        var d = textEntryBoxData[textEntryBoxName];

        _extra.variableManager.listenForVariableChange(d.data.variable, d.onVariableChange);
        d.onVariableChange();
    }

    function disableVariable(textEntryBoxName) {
        var d = textEntryBoxData[textEntryBoxName];
        _extra.variableManager.stopListeningForVariableChange(d.data.variable, d.onVariableChange);
    }

    ///////////////////////
    ////////// Confirm Variable Initilization.
    ///////////////////////
    function onVariablesInit() {
        _extra.eventManager.eventDispatcher.removeEventListener("variablesInitialized", onVariablesInit);
        areVariablesInitliazed = true;
        if (behaviourModuleInfo.enabled) {
            for (var textEntryBoxName in textEntryBoxData) {
                if (textEntryBoxData.hasOwnProperty(textEntryBoxName)) {
                    enableVariable(textEntryBoxName);
                }
            }
        }
    }

    _extra.eventManager.eventDispatcher.addEventListener("variablesInitialized", onVariablesInit);






    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// Initialization
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    if (_extra.preferenceManager.registerPreferenceModule("PreventTEBOverwrite", behaviourModuleInfo)) { //xprefPreventTEBOverwrite



        // The behaviour manager has approved of us being instantiated! Proceed.
        _extra.slideObjects.allObjectsOfTypeCallback.addCallback(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX, function (textEntryBoxName) {

            hasCollectedTextBoxData = true;

            // Get the data for the text entry box
            var tebData = _extra.dataManager.getSlideObjectDataByName(textEntryBoxName);

            textEntryBoxData[textEntryBoxName] = {
                "data": tebData,
                "onVariableChange": function () {
                    tebData.defaultText = _extra.variableManager.getVariableValue(tebData.variable);
                }
            };

            if (behaviourModuleInfo.enabled && areVariablesInitliazed) {
                enableVariable(textEntryBoxName);
            }

        });

    }

}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 2:04 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideManager_software", ["softwareInterfacesManager", "Callback"], function () {

    "use strict";

    var slideIds = _extra.captivate.model.data.project_main.slides.split(","),
        tempBaseData,
        tempContainerData;

    _extra.slideManager = {
        "_slideDatas": [],
        "slideNames": [],
        "currentSlideId":null,
        "currentSlideDOMElement":_extra.w.document.getElementById("div_Slide"),
        "isSlideLoaded":false,
        "gotoSlide":function (index) {
            if (typeof index === "string") {
                index = _extra.slideManager.getSlideIndexFromName(index);
            }

            _extra.captivate.interface.gotoSlide(index);
        },
        "getCurrentSlideNumber": function() {
            return _extra.captivate.variables.cpInfoCurrentSlideIndex;
        },
        "getCurrentSceneNumber": function () {
            return 0;
        },
        "hasSlideObjectOnSlide": function (slideObjectName, slideIndex) {

            if (!slideIndex) {
                slideIndex = _extra.slideManager.currentSlideNumber;
            }

            var details = _extra.captivate.model.data[slideObjectName];

            return details && details.apsn === slideIds[slideIndex];

        },
        "software_onSlideEnter":function() {

            this.currentSlideId = slideIds[_extra.slideManager.currentSlideNumber];

        }
    };


    ////////////////////////////////
    ////////// slideNames Array Setup

    slideIds.forEach(function(slideID){
        tempBaseData = _extra.captivate.model.data[slideID];
        tempContainerData = _extra.captivate.model.data[slideID + "c"];
        _extra.slideManager._slideDatas.push({
            "base":tempBaseData,
            "container":tempContainerData
        });
        _extra.slideManager.slideNames.push(tempBaseData.lb);
    });



    ///////////////////////////////////////////////////////////////////////
    /////////////// ON ENTER SLIDE
    ///////////////////////////////////////////////////////////////////////
    _extra.slideManager.addEnterSlideEventListener = function (callback) {
        // For some reason in Chrome when this is called we can't send anything to the console.
        // However, the code is still working.
        _extra.captivate.eventDispatcher.addEventListener(_extra.captivate.events.SLIDE_ENTER, callback);
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// ON EXIT SLIDE
    ///////////////////////////////////////////////////////////////////////
    _extra.captivate.eventDispatcher.addEventListener(_extra.captivate.events.SLIDE_EXIT, function () {
        _extra.slideManager.isSlideLoaded = false;
    });


}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 5:10 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideManager_global",["slideManager_software"],function() {

    "use strict";

    _extra.slideManager.currentSceneNumber = 0;
    _extra.slideManager.currentSlideNumber = 0;
    _extra.slideManager.currentSlideID = "0.0";

    /**
     * Returns an object that formats the data for a particular slide.
     * @param index
     * @returns {*}
     */
    _extra.slideManager.getSlideData = function (index) {
        if (typeof index === "string") {
            index = _extra.slideManager.getSlideIndexFromName(index);
        } else if (index === undefined) {
            index = _extra.slideManager.currentSlideNumber;
        }

        if (index === -1) {
            return null;
        } else {
            return new _extra.classes.SlideDataProxy(_extra.slideManager._slideDatas[index]);
        }
    };


    /**
     * Converts a slide name into a slide index.
     * @param name
     * @returns {*}
     */
    _extra.slideManager.getSlideIndexFromName = function (name) {
        return _extra.slideManager.slideNames.indexOf(name);
    };

    /**
     * Allows you to register with the slideManager to be informed when we enter a new slide.
     * Register '*' to be informed of all slides.
     * Register a number (eg: 3) to be informed when we reach that particular slide.
     * @type {_extra.classes.Callback}
     */
    _extra.slideManager.enterSlideCallback = new _extra.classes.Callback();




    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// ON SLIDE ENTER
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    // This is the start point for a lot of functionality
    function onSlideEnter() {
        var currentScene = _extra.slideManager.getCurrentSceneNumber(),
            currentSlide = _extra.slideManager.getCurrentSlideNumber(),
            currentSlideID = currentScene + "." + currentSlide;

        _extra.slideManager.currentSceneNumber = currentScene;
        _extra.slideManager.currentSlideNumber = currentSlide;
        _extra.slideManager.currentSlideID = currentSlideID;

        // Notify all callbacks registered as universal (or "*")
        _extra.slideManager.enterSlideCallback.sendToCallback("*", currentSlideID);

        // Manage any special things that should be done for the software.
        if (_extra.slideManager.hasOwnProperty("software_onSlideEnter")) {
            _extra.slideManager.software_onSlideEnter();
        }

        // If we are on the first scene of the project, then we'll allow callbacks that don't define scene number.
        // Such as: 3
        if (currentScene === 0) {
            _extra.slideManager.enterSlideCallback.sendToCallback(currentSlide, currentSlideID);
        }


        // Notify all callbacks registered to this specific scene and slide index (1.3)
        _extra.slideManager.enterSlideCallback.sendToCallback(currentSlideID, currentSlideID);



    }

    // From now on, when moving into a new slide, we'll call the above function,
    _extra.slideManager.addEnterSlideEventListener(onSlideEnter);

    // Call this onLoad, as that is the first slide.
    return onSlideEnter;



    // TODO: Define: play, pause, gotoPreviousSlide, gotoNextSlide, currentSlideNumber
});
/* global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectManager_software", ["generalDataManager", "Callback", "slideManager_global"], function () {
   "use strict";


    _extra.slideObjects = {
        "allObjectsOfTypeCallback": new _extra.classes.Callback(),
        /**
         * This function takes a query, converts it into a list of slide objects, then applies a function to those slide objects.
         *
         * Useful for enhancing Captivate's own internal show, hide, and enable, disable functions.
         */
        "enactFunctionOnSlideObjects": function (query, method) {
            if (query.indexOf(_extra.slideObjects.WILDCARD_CHARACTER) > -1) {

                var list = _extra.slideObjects.getSlideObjectNamesMatchingWildcardName(query, false);

                for (var i = 0; i < list.length; i += 1) {

                    method(list[i]);

                }

            } else {

                method(query);

            }
        },
        "hasSlideObjectInProject":function (slideObjectName) {
            return _extra.captivate.allSlideObjectsData.hasOwnProperty(slideObjectName);
        },
        "getSlideObjectElement": function(id) {
            return _extra.w.document.getElementById(id);
        },
        "hide":function (query) {
            _extra.slideObjects.enactFunctionOnSlideObjects(query, _extra.captivate.api.hide);
        },
        "show":function (query) {
            _extra.slideObjects.enactFunctionOnSlideObjects(query, _extra.captivate.api.show);
        },
        "enable":function (query) {
            _extra.slideObjects.enactFunctionOnSlideObjects(query, _extra.captivate.api.enable);
        },
        "disable":function (query) {
            _extra.slideObjects.enactFunctionOnSlideObjects(query, _extra.captivate.api.disable);
        },
        "getSlideObjectNamesMatchingWildcardName": function (query, returnProxies) {

            var wildcardIndex = query.indexOf(_extra.slideObjects.WILDCARD_CHARACTER);
            if (wildcardIndex > -1) {

                // There is a wildcard character in the query.

                // The following comments are written as if the query passed is is: My_@_Box

                // The part of the query before the wildcard character: My_
                var start = query.substr(0,wildcardIndex),
                // The part of the query after the wildcard character: _Box
                    end = query.substr(wildcardIndex + 1, query.length - 1),

                    slide = _extra.slideManager.currentSlideDOMElement,
                    id,
                    list = [],
                    child;

                for (var i = 0; i < slide.childNodes.length; i += 1) {
                    child = slide.childNodes[i];
                    id = child.id;

                    // Check if this slide objects's name matches the first part of the passed in query.
                    if (id.substr(0,start.length) === start) {

                        // Now check if it matches the last part.
                        if (id.substr(id.length - end.length, id.length - 1) === end) {

                            // The query matches, so we'll add this child to the list of display objects we'll return.
                            if (returnProxies) {

                                list.push(_extra.slideObjects.getSlideObjectProxy(id));

                            } else {

                                list.push(id);

                            }

                        }

                    }
                }

                // If we have found no matches, then return nothing.
                if (list.length === 0) {
                    list = null;
                }

                return list;
            }

            // Endpoint if no wildcard was passed in.
            return null;

        }
    };



    ////////////////////
    ///// ON LOAD CALLBACK
    ////////////////////
    return function () {

        // Go through the data for all objects in the project in order to find all of a certain type.
        // Then send their names to the allObjectsOfTypeCallback.
        // Directly this functionality is for the TextEntryBox Behaviour module.
        var projectData = _extra.captivate.allSlideObjectsData,
            slideObjectData,
            slideObjectType;

        for (var slideObjectName in projectData) {
            if (projectData.hasOwnProperty(slideObjectName)) {

                slideObjectData = projectData[slideObjectName];
                slideObjectType = _extra.dataTypes.convertSlideObjectType(slideObjectData.type);

                _extra.slideObjects.allObjectsOfTypeCallback.sendToCallback(slideObjectType, slideObjectName);

            }
        }

    };

    /*_extra.slideObjectManager = {
        "types": {
            "CLOSE_PATH":4,
            "CLICK_BOX":13,
            "HIGHLIGHT_BOX":14,
            "CAPTION":19,
            "TEXT_ENTRY_BOX":24,
            "TEXT_ENTRY_BOX_SUBMIT_BUTTON":75,
            "BUTTON":177
        },
        "projectTypeCallback":new _extra.classes.Callback()
    };

    return function () {
        var pd = _extra.dataManager.projectSlideObjectData,
            c = _extra.slideObjectManager.projectTypeCallback,
            slideObjectName,
            slideObjectData;

        for (slideObjectName in pd) {

            if (pd.hasOwnProperty(slideObjectName)) {

                //_extra.log(pd);
                slideObjectData = pd[slideObjectName];

                c.sendToCallback(slideObjectData.type, slideObjectData);

            }
        }
    };*/
},_extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 6:06 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectManager_global", ["slideObjectManager_software"], function () {
    "use strict";


    /**
     * List of proxy objects associated with slideObjects. This helps us avoid duplication.
     * @type {{}}
     */
    var slideObjectProxies = {};

    _extra.slideObjects.WILDCARD_CHARACTER = "@";
    /**
     * When entering a slide, the manager will look through all the slide objects on that slide and send the relevant
     * slide object names to this callback.
     * @type {_extra.classes.Callback}
     */
    _extra.slideObjects.enteredSlideChildObjectsCallbacks = new _extra.classes.Callback();
    _extra.slideObjects.getSlideObjectProxy = function (id) {


        var DOMElement;

        // If we were passed in a DOM element rather than the id of a DOM element...
        if (typeof id === "object") {
            DOMElement = id;
            id = DOMElement.id;
        } else {
            // We were given the id of a dom element, so we have to find it.
            DOMElement = _extra.slideObjects.getSlideObjectElement(id);
            //DOMElement = _extra.w.document.getElementById(id);

            // If we could not find the slide object, then... BYE BYE!
            if (!DOMElement) {
                return null;
            }
        }

        // Create new proxy object IF a proxy object hasn't already been created.
        // Otherwise we'll return the previous object.
        if (!slideObjectProxies[id]) {
            // Set this first, because it's possible hasProxyFor will be checked before the proxy has had a chance
            // to be assigned. The line below prevents an infininte loop.
            slideObjectProxies[id] = true;
            slideObjectProxies[id] = _extra.factories.createSlideObjectProxy(id, DOMElement);
        }



        return slideObjectProxies[id];

    };

    _extra.slideObjects.hasProxyFor = function (slideObjectName) {
        return slideObjectProxies.hasOwnProperty(slideObjectName);
    };

    _extra.slideObjects.getSlideObjectByName = function (query) {

        if (query.indexOf(_extra.slideObjects.WILDCARD_CHARACTER) > -1) {

            // There is a wildcard, so we'll return a list.
            return _extra.slideObjects.getSlideObjectNamesMatchingWildcardName(query, true);

        } else {

            // No wildcard. Grab the object directly of this name.
            return _extra.slideObjects.getSlideObjectProxy(query);

        }

    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// ON SLIDE ENTER
    ///////////////////////////////////////////////////////////////////////
    _extra.slideManager.enterSlideCallback.addCallback("*", function () {

        // Run through the list of slide object proxies and unload them
        for (var slideObjectName in slideObjectProxies) {
            if (slideObjectProxies.hasOwnProperty(slideObjectName)) {

                slideObjectProxies[slideObjectName].unload();

            }
        }

        // Clear the proxy list as we are on a new slide with new objects
        slideObjectProxies = {};

        var slideData = _extra.slideManager.getSlideData();

        for (var i = 0; i < slideData.slideObjects.length; i += 1) {
            slideObjectName = slideData.slideObjects[i];

            _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback("*", slideObjectName);

            //_extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback(_extra.slideManager.currentSlideNumber, slideObjectName);

        }

    });
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 9:27 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectProxyAutoInstantiator", ["slideObjectManager_global"], function () {

    "use strict";

    /*
    // Check if a slide object needs to be created
                if (_extra.slideManager.hasSlideObjectOnSlide(slideObjectName) &&
                   !_extra.slideObjects.doesProxyExistFor(slideObjectName)) {

                    _extra.slideObjects.getSlideObjectByName(slideObjectName);

                }
     */
    var lookupFunctions = [];

    _extra.slideObjects.proxyAutoInstantiator = {
        "check":function (slideObjectName) {

            if (_extra.slideManager.hasSlideObjectOnSlide(slideObjectName) &&
               !_extra.slideObjects.hasProxyFor(slideObjectName)) {

                _extra.slideObjects.getSlideObjectProxy(slideObjectName);

            }

        },
        "registerModelLookup":function (callback) {

            lookupFunctions.push(callback);

        },
        "hasModelDataFor":function (slideObjectName) {

            for (var i = 0; i < lookupFunctions.length; i += 1) {

                // If the lookup function returns true, it means data exists for that item.
                if (lookupFunctions[i](slideObjectName)) {
                    return true;
                }

            }

            // If we get to here without finding relevant data, none exists.
            return false;

        }
    };

    ////////////////////////////////
    ////////// When moving into a slide with and object that has data in the model
    _extra.slideObjects.enteredSlideChildObjectsCallbacks.addCallback("*", function (slideObjectName) {

        // Do we have data for this in the model?
        if (_extra.slideObjects.proxyAutoInstantiator.hasModelDataFor(slideObjectName) &&
           !_extra.slideObjects.hasProxyFor(slideObjectName)) {

            _extra.slideObjects.getSlideObjectProxy(slideObjectName);

        }


    });

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 11:15 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectUtilMethods", ["slideObjectManager_global", "eventManager"], function () {

    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// PROPERTY COMMAND
    ///////////////////////////////////////////////////////////////////////
    function handlePropertyCommand(p1, p2, modelProperty, onlyGetter) {
        // Here are the following possibilities of what's been passed in.
        ////// SET
        // slideObjectName, 100 (number)
        // slideObjectName, variable (number)
        // slide@Name, 100
        // slide@Name, variable (number)
        // variable, 100
        // variable, variable (number)
        ////// GET
        // variable, slideObjectName
        // variable, variable (slideObject)
        var p1Data = _extra.variableManager.parse.string(p1),
            p2Data = _extra.variableManager.parse.string(p2);


        ////////////////////////////////
        ////////// GETTER
        function setVariable(slideObjectName) {


            var valueToSet,
                slideObject = _extra.slideObjects.getSlideObjectByName(slideObjectName);

            if (slideObject) {

                valueToSet = slideObject[modelProperty];

            } else {

                // We have a valid slide object, but it's just not on the slide at the moment.
                // Therefore we'll grab this information from the model.
                valueToSet = _extra.slideObjects.model.retrieve(slideObjectName, modelProperty);

            }

            _extra.variableManager.setVariableValue(p1, valueToSet);
        }

        if (p2Data.isSlideObject && p1Data.isVariable) {

            setVariable(p2);


        } else if (p2Data.isVariable && p2Data.isValueSlideObject && p1Data.isVariable) {

            setVariable(p2Data.variableValue);

        }


        // For some of the properties, like width and height, we may not want to be able to change the value.
        // So we escape here.
        if (onlyGetter) {
            return;
        }



        ////////////////////////////////
        ////////// SETTER
        function setModel(slideObjectName) {
            if (p2Data.isVariable) {
                p2 = p2Data.variableValue;
            }
            _extra.slideObjects.model.write(slideObjectName, modelProperty, p2);
        }


        if (p1Data.isSlideObject) {

            setModel(p1);

        } else if (p1Data.isVariable && p1Data.isValueSlideObject) {

            setModel(p1Data.variableValue);

        } else if (p1Data.isQuery) {

            _extra.slideObjects.enactFunctionOnSlideObjects(p1, function (slideObjectName) {

                setModel(slideObjectName);

            });

        }
    }





    ///////////////////////////////////////////////////////////////////////
    /////////////// EVENT TYPES
    ///////////////////////////////////////////////////////////////////////
    var MOUSE_EVENT = "mouseevent",
        eventTypes = {
        "mouseover":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.MOUSE_OVER
        },
        "mouseout":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.MOUSE_OUT
        },
        "rollover":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.MOUSE_OVER
        },
        "rollout":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.MOUSE_OUT
        },
        "mousedown":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.MOUSE_DOWN
        },
        "mouseup":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.MOUSE_UP
        },
        "mousemove":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.MOUSE_MOVE
        },
        "click":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.CLICK
        },
        "doubleclick":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.DOUBLE_CLICK
        },
        "dblclick":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.DOUBLE_CLICK
        },
        "rightclick":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.RIGHT_CLICK
        },
        "touchstart":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.MOUSE_DOWN
        },
        "touchend":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.MOUSE_UP
        },
        "touchmove":{
            "type": MOUSE_EVENT,
            "name": _extra.eventManager.events.MOUSE_MOVE
        }
    };

    function isEventType (string, data) {

        if (eventTypes[string]) {
            data.eventType = eventTypes[string];
            return true;
        } else {
            return false;
        }

    }

    function handleEventCommand (type, p1, p2, p3, p4) {
        // Here are the following possibilities for what can be passed in.
        // event (non mouse), interactiveObject
        // event (non mouse), interactiveObject, criteria
        // slideObjectName, event (mouse), interactiveObject
        // slideObjectName, event (mouse), interactiveObject, criteria
        // slide@Name, event (mouse), interactiveObject
        // slide@Name, event (mouse), interactiveObject, criteria
        var p1Data = _extra.variableManager.parse.string(p1, isEventType),
            p2Data = _extra.variableManager.parse.string(p2, isEventType),
            p3Data = _extra.variableManager.parse.string(p3),
            p4Data = _extra.variableManager.parse.string(p4);


        function addToMediator(mediator, eventData, interactiveObjectData, criteriaData){

            if (eventData.isCustomType && interactiveObjectData.isSlideObject) {


                var criteria;

                if (criteriaData.isBlank) {
                    criteria = "success";
                } else {
                    criteria = criteriaData.value;
                }

                // Now we will add the event listener!
                // ... Or remove it as the case may be.
                mediator[type](eventData.eventType.name, interactiveObjectData.value, criteria);

            }

        }



        if (p1Data.isSlideObject) {

            addToMediator(_extra.eventManager.getEventMediator(p1), p2Data, p3Data, p4Data);

        } else if (p1Data.isVariable) {

            addToMediator(_extra.eventManager.getEventMediator(p1Data.variableValue), p2Data, p3Data, p4Data);

        } else if (p1Data.isQuery) {

            _extra.slideObjects.enactFunctionOnSlideObjects(p1, function (slideObjectName) {

                addToMediator(_extra.eventManager.getEventMediator(slideObjectName), p2Data, p3Data, p4Data);

            });

        }

    }


    ///////////////////////////////////////////////////////////////////////
    /////////////// Command Variables
    ///////////////////////////////////////////////////////////////////////
    _extra.slideObjects.enableForMouse = function (query) {

        _extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
            _extra.slideObjects.model.write(slideObjectName, "enableForMouse", true);
        });

    };
    _extra.slideObjects.disableForMouse = function (query) {

        _extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
            _extra.slideObjects.model.write(slideObjectName, "enableForMouse", false);
        });

    };
    _extra.slideObjects.setCursor = function (query, cursorType) {

        _extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
            _extra.slideObjects.model.write(slideObjectName, "cursor", cursorType);
        });

    };

    _extra.slideObjects.posX = function (p1, p2) {

        handlePropertyCommand(p1,p2,"x");

    };
    _extra.slideObjects.posY = function (p1, p2) {

        handlePropertyCommand(p1,p2,"y");

    };

    _extra.slideObjects.width = function (p1, p2) {

        handlePropertyCommand(p1,p2,"width", true);

    };
    _extra.slideObjects.height = function (p1, p2) {

        handlePropertyCommand(p1,p2,"height", true);

    };

    _extra.slideObjects.addEventListener = function (query, event, interactiveObject, criteria) {

        handleEventCommand("addEventListener",query,event,interactiveObject,criteria);

    };

    _extra.slideObjects.removeEventListener = function (query, event, interactiveObject, criteria) {

        handleEventCommand("removeEventListener",query,event,interactiveObject,criteria);

    };

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/11/15
 * Time: 3:30 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("softwareFunctionOverrideManager", ["eventManager", "softwareInterfacesManager"], function () {

    "use strict";

    var enterFrameDefaultMethod = _extra.captivate.movie._onEnterFrame;


    ///////////////////////////////////////////////////////////////////////
    /////////////// Enter Frame
    ///////////////////////////////////////////////////////////////////////
    _extra.captivate.movie._onEnterFrame = function () {

        enterFrameDefaultMethod.apply(this, arguments);
        // the Event class must be accessed through Captivate's window because the widget's window will get deleted.

        // TODO: Exchange the eventDispatcher from being a DOMElement into being a javascript object.
        _extra.eventManager.eventDispatcher.dispatchEvent(new _extra.w.Event("enterframe"));

    };


}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/09/15
 * Time: 4:15 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("softwareInterfacesManager", function () {

    "use strict";

    // Define a private object to hold the references to the different poitns in
    // the Captivate API
    _extra.captivate = {
        "api":_extra.w.cp,
        "version":_extra.w.CaptivateVersion,
        "variables":_extra.w,
        "interface":_extra.w.cpAPIInterface,
        "eventDispatcher":_extra.w.cpAPIEventEmitter,
        "model":_extra.w.cp.model,
        "allSlideObjectsData":_extra.w.cp.model.data,
        "movie":_extra.w.cp.movie,
        "events":{
            /**
             * Event Data:
             * - slideNumber
             * - frameNumber
             * - lcpversion (?)
             */
            "SLIDE_ENTER":"CPAPI_SLIDEENTER",
            /**
             * Event Data:
             * - slideNumber
             * - frameNumber
             * - lcpversion (?)
             * - percentageSlideSeen = NUMBER
             */
            "SLIDE_EXIT":"CPAPI_SLIDEEXIT",
            "PLAYBAR_SCRUBBING_BEGIN":"CPAPI_STARTPLAYBARSCRUBBING",
            "PLAYBAR_SCRUBBING_END":"CPAPI_ENDPLAYBARSCRUBBING",
            /**
             * Event Data:
             * - frameNumber
             * - includedInQuiz
             * - issuccess
             * - itemname
             * - objecttype
             * - questioneventdata
             * - slideNumber
             */
            "INTERACTIVE_ITEM_SUBMIT":"CPAPI_INTERACTIVEITEMSUBMIT",
            "MOVIE_PAUSE":"CPAPI_MOVIEPAUSE",
            "MOVIE_RESUME":"CPAPI_MOVIERESUME",
            "MOVIE_START":"CPAPI_MOVIESTART",
            "MOVIE_STOP":"CPAPI_MOVIESTOP",
            /**
             * Event Data:
             * - correctAnswer=STRING;
             * - infiniteAttempts=BOOLEAN;
             * - interactionID=NUMBER;
             * - objectiveID=STRING;
             * - questionAnswered=BOOLEAN;
             * - questionAnsweredCorrectly=BOOLEAN;
             * - questionAttempts=NUMBER;
             * - questionMaxAttempts=NUMBER;
             * - questionMaxScore=NUMBER;
             * - questionNumber=NUMBER;
             * - questionScore=NUMBER;
             * - questionScoringType=[object Object],{Name:STRING};
             * - questionType=STRING;
             * - quizName=STRING;
             * - reportAnswers=BOOLEAN;
             * - selectedAnswer=STRING;
             * - slideNumber=NUMBER;
             */
            "QUESTION_SKIP":"CPAPI_QUESTIONSKIP",
            /**
             * Event Data:
             * - correctAnswer=STRING;
             * - infiniteAttempts=BOOLEAN;
             * - interactionID=NUMBER;
             * - objectiveID=STRING;
             * - questionAnswered=BOOLEAN;
             * - questionAnsweredCorrectly=BOOLEAN;
             * - questionAttempts=NUMBER;
             * - questionMaxAttempts=NUMBER;
             * - questionMaxScore=NUMBER;
             * - questionNumber=NUMBER;
             * - questionScore=NUMBER;
             * - questionScoringType=[object Object],{Name:STRING};
             * - questionType=STRING;
             * - quizName=STRING;
             * - reportAnswers=BOOLEAN;
             * - selectedAnswer=STRING;
             * - slideNumber=NUMBER;
             */
            "QUESTION_SUBMIT":"CPAPI_QUESTIONSUBMIT",
            /**
             * Subscribing to this event requires a third parameter to be passed into the eventListener method.
             * This third parameter should be the name of the Captivate Variable you wish to listen for.
             *
             * Event Data:
             * - captivateVersion=STRING;
             * - varName=STRING;
             * - oldVal=STRIN;
             * - newVal=STRING;
             */
            "VARIABLE_VALUE_CHANGED":"CPAPI_VARIABLEVALUECHANGED"

        }
    };

}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 29/10/15
 * Time: 10:46 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("getVariableManager", ["variableManager"] ,function () {

    "use strict";

    var getVariables;

    // Tap into the variable manager's callbacks. This is how we are notified of variables.
    _extra.variableManager.prefixCallback.addCallback("get", function (variableName) {

        ///////////////////////////////////////////////////////////////////////
        /////////////// Retrieve GET variables
        ///////////////////////////////////////////////////////////////////////
        if (!getVariables) {
            // Set up get variables.
            // This should only happen once, so that we don't waste cpu.

            // Get variable code comes from Andy E's comment at the site bellow.
            // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
            var match,
                pl     = /\+/g,  // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                query  = _extra.w.document.location.search.substring(1),
                GETVariableName;

            getVariables = {};
            while ((match = search.exec(query)) !== null) {

                GETVariableName = decode(match[1]);
                // Check if the variable name lacks the 'get_' prefix
                if (GETVariableName.substr(0,4).toLowerCase() !== "get_" &&
                    GETVariableName.substr(0,5).toLowerCase() !== "_get_") {

                    GETVariableName = "get_" + GETVariableName;
                }

                // Assign to our getVariables library.
                getVariables[GETVariableName] = decode(match[2]);
            }

        }



        ///////////////////////////////////////////////////////////////////////
        /////////////// Assign GET variables to Captivate Variables
        ///////////////////////////////////////////////////////////////////////
        var result = getVariables[variableName];

        // If we have failed to get the result of the variable because it has an underscore at the start of its name.
        if (!result && variableName.charAt(0) === "_") {
            result = getVariables[variableName.substr(1,variableName.length)];
        }

        // If this variable has not been defined
        if (result === undefined) {
            result = null;

        // If this is a number;
        } else if (!isNaN(result)) {
            result = parseFloat(result);
        }

        // Set variable value!
        _extra.variableManager.setVariableValue(variableName, result);


        // TODO: Unload this after initialization.

    });
});
/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 12:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("localStorageManager", ["variableManager"], function () {

    "use strict";


    var storageVariables;

    // When storage variables are saved is decided by the xprefSaveLocalStorage variable, whose behaviour is
    // managed by dev/managers/preferences/localStorageVariableManager.js
    _extra.variableManager.saveStorageVariables = function () {

        var storageVariableInfo,
            variableName;

        for (variableName in storageVariables) {

            if (storageVariables.hasOwnProperty(variableName)) {

                storageVariableInfo = storageVariables[variableName];
                storageVariableInfo.storage.setItem(variableName,
                                                    _extra.variableManager.getVariableValue(variableName));

            }

        }

    };

    function initializeStorageVariables() {
        storageVariables = {};
    }



    function setUpStorageVariable(variableName, storage) {

        // Initialize Storage Variables
        if (!storageVariables) {
            initializeStorageVariables();
        }

        // Check Storage
        var storageValue = storage.getItem(variableName);
        if (storageValue) {

            // If this item can be of a number type, then write it to the variable as a number type.
            if (!isNaN(storageValue)) {
                storageValue = parseFloat(storageValue);
            }



            // We do have a valid value in storage
            _extra.variableManager.setVariableValue(variableName, storageValue);
        }

        // Save this variable to our records so that we can save its value to storage at the appropriate time.
        storageVariables[variableName] = {
            "storage": storage
        };
    }

    // Tap into the variable manager's callbacks. This is how we are notified of variables.
    _extra.variableManager.prefixCallback.addCallback("ls", function (variableName) {
        setUpStorageVariable(variableName, _extra.w.localStorage);
    });

    _extra.variableManager.prefixCallback.addCallback("ss", function (variableName) {
        setUpStorageVariable(variableName, _extra.w.sessionStorage);
    });
});
/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/09/15
 * Time: 9:02 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("variableManager", ["softwareInterfacesManager", "Callback"], function () {
    "use strict";

    var variableInfo = _extra.captivate.api.variablesManager.varInfos;

    //////////////////////////
    ////// Variable Manager Object Setup
    //////////////////////////
    _extra.variableManager = {
        "prefixCallback":new _extra.classes.Callback(),
        "getVariableValue": function (variableName) {
            return _extra.captivate.interface.getVariableValue(variableName);
        },
        "setVariableValue": function (variableName, value) {
            _extra.captivate.interface.setVariableValue(variableName, value);
        },
        "hasVariable": function (variableName) {
            return _extra.captivate.variables.hasOwnProperty(variableName);
        },
        "listenForVariableChange": function (variableName, callback) {
            _extra.captivate.eventDispatcher.addEventListener("CPAPI_VARIABLEVALUECHANGED",callback,variableName);
        },
        "stopListeningForVariableChange": function(variableName, callback) {
            _extra.captivate.eventDispatcher.removeEventListener("CPAPI_VARIABLEVALUECHANGED",callback,variableName);
        }
    };


    return function () {

        var name,
            splitName,
            prefix,
            varData;

        for (var i = 0; i < variableInfo.length; i+=1) {
            varData = variableInfo[i];

            if (!varData.systemDefined) {
                // This is a user variable

                name = varData.name;
                splitName = name.split("_");
                prefix = splitName[0];

                // To support all variables as having an underscore '_' in front of their name
                // we'll check if the first index is empty (as would be true in a variable name such as _ls_myVariable)
                // If so, we'll use the second index as the variable's prefix (in that example it would be 'ls')
                if (prefix === "") {
                    prefix = splitName[1];
                }

                prefix = prefix.toLowerCase();

                // If someone has added a callback for this kind of prefix.
                _extra.variableManager.prefixCallback.sendToCallback(prefix,name);

            }

        }

        // Dispatch event to let the rest of the modules know the variables have been initialized.
        _extra.eventManager.eventDispatcher.dispatchEvent(new _extra.w.Event("variablesInitialized"));

    };

}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/10/15
 * Time: 2:36 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("dataTypeConverters",["globalSlideObjectTypes"], function () {

    "use strict";

    /*
        submitted for your interest.
        This data should be gradually migrated into the function bellow.
        var captivateSlideObjectTypes = {
            "CLOSE_PATH":4,
            "CLICK_BOX":13,
            "HIGHLIGHT_BOX":14,
            "CAPTION":19,
            "TEXT_ENTRY_BOX":24, // Implemented
            "TEXT_ENTRY_BOX_SUBMIT_BUTTON":75,
            "BUTTON":177
        };
         */

    _extra.dataTypes.convertSlideObjectType = function (cpType) {

        var soTypes = _extra.dataTypes.slideObjects;

        switch (cpType) {
            case 24 :
                return soTypes.TEXT_ENTRY_BOX;

            default :
                return soTypes.UNKNOWN;
        }
    };

}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("globalSlideObjectTypes",function () {
    "use strict";

    _extra.dataTypes = {
        "slideObjects": {
            "UNKNOWN": 0,
            "TEXT_ENTRY_BOX":1
        }
    };
    /*_extra.slideObjectsTypes = {

    };*/
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 29/10/15
 * Time: 1:07 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectModelManager", ["slideObjectManager_global", "Model", "slideObjectProxyAutoInstantiator"], function () {

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// THE SLIDE OBJECT MODEL
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    ///////////// The slide object model is used in the following cases.
    ///////////// Say we have a command variable that sets whether a slide object is mouse enabled or not.
    ///////////// If we set 'slide_object_1' to be mouse enabled on the same slide it's on, well that's simple enough.
    ///////////// But, what if it was set on another slide, and needed to be applied when we reach the slide with
    ///////////// 'slide_object_1'?
    ///////////// What's more, what if we do set 'slide_object_1' to be mouse enabled while on its slide, then go
    ///////////// to the next slide, then come back? It must remember that 'slide_object_1' should be mouse enabled.
    ///////////// To do this, we record the slide object's details here in this model. The slide object will always
    ///////////// come here to reference whether it should be mouse enabled or disabled. These methods are never
    ///////////// directly changed on the slide object. The model is changed, and the slide object updates itself.
    ///////////// That way we have consistency. And it's prettier.


    "use strict";

    _extra.slideObjects.model = new _extra.classes.Model();
    // And that's that problem fixed.
    // :-)

    ///////////////////////////////////////////////////////////////////////
    /////////////// SLIDE OBJECT PROXY CREATING
    ///////////////////////////////////////////////////////////////////////

    ////////////////////////////////
    ////////// When slide object is on slide
    // Handling the case where model data is set for an object which doesn't have a proxy created to handle it
    var originalWriteMethod = _extra.slideObjects.model.write;
    // Parasite on to the write function
    _extra.slideObjects.model.write = function(slideObjectName, property, value) {

        // Default behaviour
        originalWriteMethod(slideObjectName, property, value);

        // Check if a slide object needs to be created
        _extra.slideObjects.proxyAutoInstantiator.check(slideObjectName);
    };

    _extra.slideObjects.proxyAutoInstantiator.registerModelLookup(_extra.slideObjects.model.hasDataFor);


});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 4:24 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("registerStateMetaData",["slideObjectManager_global", "SlideObjectStateManager", "slideManager_global","stateManager_global"], function () {

    "use strict";

    var stateManagers = {},
        ROLLOVER = "r",
        MOUSEDOWN = "d",
        NORMAL = "n";



    ///////////////////////////////////////////////////////////////////////
    /////////////// Register States for Automatic Switching
    ///////////////////////////////////////////////////////////////////////
    _extra.slideObjects.states.registerStateMetaData = function (slideObjectName, data) {


        var slideObjectProxy,
            currentSlideID = _extra.slideManager.currentSlideID,
            currentSlideStateManagers;

        // If this is the first slide object to be registering for the current slide
        if (!stateManagers[currentSlideID]) {
            stateManagers[currentSlideID] = {};
        }
        currentSlideStateManagers = stateManagers[currentSlideID];

        // If we have already details about this object here, then something has gone wrong.
        if (currentSlideStateManagers[slideObjectName]) {
            _extra.error("At _extra.slideObjects.states.registerStateMetaData, tried to register data for '" + slideObjectName + "' twice. " +
            "Has unloading of this data from a previous slide been unsuccessful?");

        }

        slideObjectProxy = _extra.slideObjects.getSlideObjectByName(slideObjectName);
        currentSlideStateManagers[slideObjectName] = new _extra.classes.SlideObjectStateManager(slideObjectProxy, data);


    };


    _extra.slideObjects.states.isAutomaticallyChangingStates = function (comparisonName) {

        var slideManager,
            slideID,
            slideObjectName;

        for (slideID in stateManagers) {
            if (stateManagers.hasOwnProperty(slideID)) {

                slideManager = stateManagers[slideID];

                for (slideObjectName in slideManager) {
                    if (slideManager.hasOwnProperty(slideObjectName)) {

                        if (slideObjectName === comparisonName) {
                            return true;
                        }

                    }
                }

            }
        }

        return false;

    };


    ///////////////////////////////////////////////////////////////////////
    /////////////// Unload State Managers From Previous Slides
    ///////////////////////////////////////////////////////////////////////

    _extra.slideManager.enterSlideCallback.addCallback("*", function (currentSlideID) {
        var slideManager,
            slideID,
            slideObjectName;

        for (slideID in stateManagers) {

            // If we are moving into state managers for a slide which is not the current slide...
            if (stateManagers.hasOwnProperty(slideID) && slideID !== currentSlideID) {

                slideManager = stateManagers[slideID];

                // Then we'll want to unload these state managers
                for (slideObjectName in slideManager) {
                    if (slideManager.hasOwnProperty(slideObjectName)) {

                        slideManager[slideObjectName].unload();

                    }
                }

                // Remove this information so we don't have to loop through it next slide.
                delete stateManagers[slideID];
            }
        }
    });



    ///////////////////////////////////////////////////////////////////////
    /////////////// Parse State Names
    ///////////////////////////////////////////////////////////////////////
    _extra.slideObjects.enteredSlideChildObjectsCallbacks.addCallback("*", function (slideObjectName) {




        // This function is sent the name of every slide object on the current slide, one by one.
        // It will analyse its states to see if there are any that interact with extra.
        var data = _extra.dataManager.getSlideObjectDataByName(slideObjectName),
            stateName,
            splitStateName,
            slideObjectMetaData = {},
            result;


        function detectIfMouseEvent(event){
            switch (event.toLowerCase()) {
                case "down":
                case "mousedown":
                    return MOUSEDOWN;


                case "rollover":
                case "over":
                case "mouseover":
                    return ROLLOVER;

                case "normal":
                    // Although the default case of returning 'null' will eventually be turned to NORMAL anyway,
                    // We have to return NORMAL here so that the 'normal' keyword is removed from the splitName array in getMouseEvent().
                    return NORMAL;

                // Not a mouse event
                default :
                    return null;
            }
        }

        function getMouseEvent(splitName) {
            // check to see if the first section of the state name (x_MYVARIABLE_down) is a mouse evenet.
            result = detectIfMouseEvent(splitName[0]);

            if (result) {
                // Remove the mouse index
                splitName.shift();

                // If we have not found an event AND the last index is not the first index.
            } else if (splitName.length > 1) {
                result = detectIfMouseEvent(splitName[splitName.length - 1]);

                if (result) {
                    // Remove the last index
                    splitName.length -= 1;
                }
            }

            if (result) {
                return result;
            } else {
                return NORMAL;
            }
        }


        function getVariablesData(splitName, fullName) {
            var variableData = {},
                previousIndexVariable = false,
                potentialVariableName,
                segment;

            // There are multiple places in the loop below where we might want to register a variable, so we abstract
            // that functionality into a function.
            function registerVariable(variableName) {

                // x_var_var
                if (variableData.hasOwnProperty(variableName)) {

                    _extra.error("State name '" + fullName + "' illegally tried to register '" + variableName + "' twice.");

                } else {

                    variableData[variableName] = null;

                }

            }

            // Turn strings into Booleans
            function validateVariableValue(value) {
                switch (value.toLowerCase()) {
                    case "true":
                        return true;

                    case "false":
                        return false;

                    default :
                        return value;
                }
            }


            ////////////////////////////////
            ////////// Begin looping through the state names.

            // x_var_ls_variable_name
            // Currently the above format is not supported as I can't think of a way to confirm that
            // 'ls' is part of a a variable name and not the value that 'var' should be set to.
            for (var i = 0; i < splitName.length; i += 1) {

                segment = splitName[i];

                if (previousIndexVariable) {

                    if(isNaN(segment)) {

                        // x_var1_var2
                        if (_extra.variableManager.hasVariable(segment)) {

                            registerVariable(segment);

                            previousIndexVariable = segment;

                        // x_var1_value
                        } else {
                            variableData[previousIndexVariable] = validateVariableValue(segment);
                            previousIndexVariable = null;
                        }

                    // x_var_1
                    } else {

                        variableData[previousIndexVariable] = parseInt(segment);
                        previousIndexVariable = null;

                    }

                } else {

                    // If we have been dealing with a variable name that has underscores, then we may have been
                    // building up the variable's name in the potentialVariableName
                    if (potentialVariableName) {
                        segment = potentialVariableName + "_" + segment;
                        potentialVariableName = null;
                    }
                    // x_var
                    if (_extra.variableManager.hasVariable(segment)) {
                        registerVariable(segment);
                        // If the previous index was a value, then this index MUST be a variable.
                        previousIndexVariable = segment;

                    // x_invalidVar OR x_var_name
                    } else {

                        // x_invalidVar
                        if (i >= splitName.length - 1) {
                            _extra.error("Could not find variable by the name of '" + segment +
                                         "' as present in state name: '" + fullName + "'");
                        // x_var_name
                        } else {
                            // We have yet to reach the end of the array, so there's still potential this is an invalid
                            // name, but for the moment we'll assume we're working with a variable name with
                            // underscores.
                            potentialVariableName = segment;
                        }
                    }


                }


            }

            if (Object.keys(variableData).length <= 0) {
                return null;
            }

            return variableData;
        }









        for (var i = 0; i < data.states.length; i += 1) {

            stateName = data.states[i];

            if (stateName.substr(0,2).toLowerCase() === "x_") {

                // The following comments assume that the state name is: x_myvariable_down
                splitStateName = stateName.split("_");
                splitStateName.shift(); // Remove the first index which is 'x' anyway.

                result = getMouseEvent(splitStateName);
                if (!slideObjectMetaData[result]) {
                    slideObjectMetaData[result] = {};
                }

                slideObjectMetaData[result][stateName] = getVariablesData(splitStateName, stateName);

            }
        }


        if (Object.keys(slideObjectMetaData).length > 0) {
            // If this variable has a value, it means we must have run across a valid method at some point.
            // Therefore, we register the meta data.
            _extra.slideObjects.states.registerStateMetaData(slideObjectName, slideObjectMetaData);
        }


    });

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/10/15
 * Time: 7:18 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("stateManager_software",["Callback","slideObjectManager_global"],function () {
    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// Replace Native Change State Method
    ///////////////////////////////////////////////////////////////////////
    var nativeChangeStateMethod = _extra.captivate.api.changeState;
    _extra.captivate.api.changeState = function (slideObjectName, state) {


        // Notify callbacks of state change.
        var changeDetails = {
            "slideObjectName":slideObjectName,
            "stateName": state
        };
        _extra.slideObjects.states.changeCallback.sendToCallback("*", changeDetails);
        _extra.slideObjects.states.changeCallback.sendToCallback(slideObjectName, changeDetails);

        // We call the native function after the callbacks to avoid any 'mouse out' hijinks.
        nativeChangeStateMethod(slideObjectName, state);
    };
    ///////////////////////////////////////////////////////////////////////
    /////////////// Define Main Methods
    ///////////////////////////////////////////////////////////////////////

    _extra.slideObjects.states = {
        "change":function (query, state) {
            _extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
                _extra.captivate.api.changeState(slideObjectName, state);
            });
        },
        "changeCallback": new _extra.classes.Callback()
    };

}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/10/15
 * Time: 7:24 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("stateManager_global",["stateManager_software"],function () {
    "use strict";



});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 9:38 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("commandVariableManager",["variableManager","stateManager_global"], function () {

    "use strict";

    var COMMAND_VARIABLE_PREFIX = "xcmnd",
        variableName,
        commandVariables = {};


    ////////////////////////////////
    ////////// Parameter Handler Types

    // When a command variable is sent something like: 1,2,3,4
    // These functions decide how the parameters should be sent to the function tied into the variable.
    _extra.variableManager.parameterHandlers = {
        // This one sends them like this:
        // callback(1,2,3,4);
        "sendParametersAsParameters": function (parameters, callback) {
            callback.apply(_extra, parameters);
        },
        // This one sends them like this:
        // callback(1);
        // callback(2);
        // callback(3);
        // callback(4);
        "executeOncePerParameter": function (parameters, callback) {

            for (var i = 0; i < parameters.length; i += 1) {

                callback(parameters[i]);

            }

        }
    };

    ////////////////////////////////
    ////////// registerCommandVariable method

    // There may be other parts of the program who wish to register their own command variables (perhaps individual ones for Captivate or Storyline)
    // So we expose function to allow them to register.
    _extra.variableManager.registerCommandVariable = function (variableSuffix, callback, parameterHandler) {
        if (commandVariables[variableSuffix]) {
            return;
        }

        if (!parameterHandler) {

            // Default method for parameter handling is to invoke the callback once for each parameter.
            parameterHandler = _extra.variableManager.parameterHandlers.executeOncePerParameter;

        }

        commandVariables[variableSuffix] = {
            "callback":callback,
            "parameterHandler": parameterHandler
        };
    };



    ///////////////////////////////////////////////////////////////////////
    /////////////// SETTING UP COMMAND VARIABLES
    ///////////////////////////////////////////////////////////////////////
    return function () {



        function listenForCommandVariableChange(variableName,variableMetadata) {


            _extra.variableManager.listenForVariableChange(variableName, function () {

                var value = _extra.variableManager.getVariableValue(variableName);

                // If we have been given nothing, then we will not bother informing the command variable.
                // This likely comes from clearing the command variable after enacting its command.
                if (value !== "") {

                    // Remove spaces from value string
                    value = value.replace(/\s+/g,'');
                    var parameters = value.split(",");
                    variableMetadata.parameterHandler(parameters, variableMetadata.callback);
                    _extra.variableManager.setVariableValue(variableName,"");

                }


            });
        }

        // We will now go through all the command variables and set them up.
        for (var variableSuffix in commandVariables) {
            if (commandVariables.hasOwnProperty(variableSuffix)) {

                variableName = COMMAND_VARIABLE_PREFIX + variableSuffix;

                // Check to find valid variable.
                if (!_extra.variableManager.hasVariable(variableName)) {

                    // Variable with normal name doesn't exist. Try to find one with a semicolon in front.
                    variableName = "_" + variableName;

                    if (!_extra.variableManager.hasVariable(variableName)) {

                        // There is no valid variable by this name. Continue to the next one.
                        continue;

                    }

                }

                // Now set up the variable's behaviour
                listenForCommandVariableChange(variableName, commandVariables[variableSuffix]);

            }
        }


        // Unload
        commandVariables = null;
        _extra.variableManager.registerCommandVariable = null;
        _extra.variableManager.parameterHandlers = null;

    };





});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/11/15
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("commandVariables_software", ["commandVariables_global", "actionManager"], function () {

    "use strict";

    var register = _extra.variableManager.registerCommandVariable,
        handlers = _extra.variableManager.parameterHandlers;

    // Note: This doesn't work with @ syntax
    register("CallActionOn", _extra.actionManager.callActionOn, handlers.sendParametersAsParameters);

    ////////////////////////////////
    ////////// Event Handler
    register("AddEventListener", _extra.slideObjects.addEventListener, handlers.sendParametersAsParameters);
    register("RemoveEventListener", _extra.slideObjects.removeEventListener, handlers.sendParametersAsParameters);

}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 8:14 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("commandVariables_global", ["commandVariableManager", "slideObjectUtilMethods"], function () {

    "use strict";

    var register = _extra.variableManager.registerCommandVariable,
        handlers = _extra.variableManager.parameterHandlers;

    ///////////////////////////////////////////////////////////////////////
    /////////////// BASIC COMMAND VARIABLES
    ///////////////////////////////////////////////////////////////////////
    ////////////////////////////////
    ////////// Extend Captivate Functions
    register("Hide", _extra.slideObjects.hide);
    register("Show", _extra.slideObjects.show);
    register("Enable", _extra.slideObjects.enable);
    register("Disable", _extra.slideObjects.disable);

    register("ChangeState", _extra.slideObjects.states.change, handlers.sendParametersAsParameters);


    ////////////////////////////////
    ////////// Mouse Enable
    register("EnableForMouse", _extra.slideObjects.enableForMouse);
    register("DisableForMouse", _extra.slideObjects.disableForMouse);

    ///////////////////////////////////////////////////////////////////////
    /////////////// ADVANCED COMMAND VARIABLES
    ///////////////////////////////////////////////////////////////////////
    ////////////////////////////////
    ////////// Cursor
    register("SetCursor", _extra.slideObjects.setCursor, handlers.sendParametersAsParameters);

    ////////////////////////////////
    ////////// Position
    register("PosX", _extra.slideObjects.posX, handlers.sendParametersAsParameters);
    register("PosY", _extra.slideObjects.posY, handlers.sendParametersAsParameters);

    ////////////////////////////////
    ////////// Width / Height
    register("Width", _extra.slideObjects.width, handlers.sendParametersAsParameters);
    register("Height", _extra.slideObjects.height, handlers.sendParametersAsParameters);





});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 7:51 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("parameterParser", ["variableManager"], function () {

    "use strict";

    _extra.variableManager.parse = {
        "string":function (string, customType) {

            var data = {
                "value":string
            };

            if (string) {

                data.isSlideObject = _extra.slideObjects.hasSlideObjectInProject(string);
                data.isVariable = _extra.variableManager.hasVariable(string);
                data.isQuery = string.indexOf(_extra.slideObjects.WILDCARD_CHARACTER) !== -1;

                // If we have custom type and have not found it to match any of the other types.
                if (customType && !data.isSlideObject && !data.isVariable && !data.isQuery) {
                    data.isCustomType = customType(string, data);
                }

            } else {

                // Null string
                data.isSlideObject = false;
                data.isVariable = false;
                data.isQuery = false;
                data.isBlank = true;

            }


            // Check variable data
            if (data.isVariable) {

                var value = _extra.variableManager.getVariableValue(string);
                data.isValueNumber = !isNaN(value);

                if (data.isValueNumber) {
                    value = parseFloat(value);
                    data.isValueSlideObject = false;
                } else if (value !== null) {
                    // Remove spaces from value string
                    value = value.replace(/\s+/g,'');
                    data.isValueSlideObject = _extra.slideObjects.hasSlideObjectInProject(value);
                    data.isValueQuery = value.indexOf(_extra.slideObjects.WILDCARD_CHARACTER) !== -1;
                }

                // Put at the end to ensure any changing of type is handled.
                data.variableValue = value;
            }

            return data;
        }
    };

});