/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/09/15
 * Time: 9:33 AM
 * To change this template use File | Settings | File Templates.
 */
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
        if (_extra.console) {
            _extra.console.log(message);
        }
    };


    /**
     * Send an error to the debug console of the browser, assuming the console is available.
     * @param message
     */
    _extra.error = function (message) {
        if (_extra.console) {
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
        "build":"2503"
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

                    m.onLoadCallback();

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

        window.removeEventListener("unload", onStorylineLoaded);

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
            slideObject.removeEventListener("mouseover", that.onRollover);
            // Update Information
            isMouseOver = true;
            // Change State
            evaluateState();
            // Listen for new mouse event
            slideObject.addEventListener("mouseout", that.onRollout);
        };

        this.onRollout = function () {

            slideObject.removeEventListener("mouseout", that.onRollout);
            isMouseOver = false;
            evaluateState();
            slideObject.addEventListener("mouseover", that.onRollover);

        };

        ////////////////////////////////
        ////////// Mouse Down
        this.onMouseDown = function () {

            slideObject.removeEventListener("mousedown", that.onMouseDown);
            isMouseDown = true;
            evaluateState();
            _extra.w.document.addEventListener("mouseup", that.onMouseUp);

        };

        this.onMouseUp = function () {

            _extra.w.document.removeEventListener("mouseup", that.onMouseUp);
            isMouseDown = false;
            evaluateState();
            slideObject.addEventListener("mousedown", that.onMouseDown);

        };

        ////////////////////////////////
        ////////// Start Listening
        if (data.r) {
            slideObject.addEventListener("mouseover", this.onRollover);
        }

        if (data.d) {
            slideObject.addEventListener("mousedown", this.onMouseDown);
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
        this.slideObject.removeEventListener("mouseover", this.onRollover);
        this.slideObject.removeEventListener("mouseout", this.onRollout);
        this.slideObject.removeEventListener("mousedown", this.onMouseDown);
        _extra.w.document.removeEventListener("mouseup", this.onMouseUp);

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
_extra.registerModule("eventManager", function () {
    "use strict";
    _extra.eventDispatcher = document.createElement("p");
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
        this._name = name;
        this._data = data;
        this._type = type;
    }

    BaseSlideObjectData.prototype = {
        get name(){
            return this._name;
        },
        get data() {
            return this._data;
        },
        get type(){
            return this._type;
        },
        get states() {
            if (!this._states) {
                this._states = [];

                _extra.error("BaseSlideObjectData.states has yet to be implemented");
            }

            return this._states;
        }
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

    function BaseSlideObjectProxy(element, data) {
        this.DOMElement = element;
        this._data = data;
    }

    BaseSlideObjectProxy.prototype = {
        get name(){
            return this.DOMElement.id;
        },
        get data() {
            return this._data;
        },
        get type(){
            return this._data.type;
        }
    };

    BaseSlideObjectProxy.prototype.changeState = function (stateName) {
        _extra.slideObjects.states.change(this.name, stateName);
    };

    BaseSlideObjectProxy.prototype.unload = function () {

    };

    _extra.registerClass("BaseSlideObjectProxy", BaseSlideObjectProxy, _extra.STORYLINE);

}, _extra.STORYLINE);
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
        this.name = data.title;
    }

    _extra.registerClass("SlideDataProxy", SlideDataProxy, _extra.STORYLINE);

}, _extra.STORYLINE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/10/15
 * Time: 11:00 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("StateDataProxy",function () {

    "use strict";

    function StateDataProxy() {

    }

    _extra.registerClass("StateDataProxy", StateDataProxy);

}, _extra.CAPTIVATE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 6:09 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("TextEntryBoxDataProxy", ["BaseSlideObjectDataProxy"], function () {
    "use strict";

    function TextEntryBoxDataProxy(name, data, type) {
        // Call super constructor
        _extra.classes.BaseSlideObjectDataProxy.call(this, name, data, type);
    }




    _extra.registerClass("TextEntryBoxDataProxy", TextEntryBoxDataProxy,"BaseSlideObjectDataProxy", _extra.STORYLINE);

    Object.defineProperty(TextEntryBoxDataProxy.prototype,"variable", {
            get: function() {
                _extra.error("TextEntryBoxDataProxy.variable has yet to be defined!");
                return null;
            }
        });
}, _extra.STORYLINE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 3:54 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("generalDataManager", ["softwareInterfacesManager"], function () {

    "use strict";

    _extra.dataManager = {

    };

    _extra.dataManager.getSlideObjectDataByName = function () {
        _extra.error("_extra.dataManager.getSlideObjectDataByName has yet to be implemented");
    };

}, _extra.STORYLINE);
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

                if (_extra.variableManager.getVariableValue(preferenceVariable)) {

                    if (!preferenceInfo.enabled) {
                        preferenceInfo.enable();
                        preferenceInfo.enabled = true;
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

        // If we are on the first scene of the project, then we'll allow callbacks that don't define scene number.
        // Such as: 3
        if (currentScene === 0) {
            _extra.slideManager.enterSlideCallback.sendToCallback(currentSlide, currentSlideID);
        }


        // Notify all callbacks registered to this specific scene and slide index (1.3)
        _extra.slideManager.enterSlideCallback.sendToCallback(currentSlideID, currentSlideID);


        if (_extra.slideManager.hasOwnProperty("software_onSlideEnter")) {
            _extra.slideManager.software_onSlideEnter();
        }
    }

    // From now on, when moving into a new slide, we'll call the above function,
    _extra.slideManager.addEnterSlideEventListener(onSlideEnter);

    // Call this onLoad, as that is the first slide.
    return onSlideEnter;



    // TODO: Define: play, pause, gotoPreviousSlide, gotoNextSlide, currentSlideNumber
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 2:04 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideManager_software", ["softwareInterfacesManager","Callback"], function () {

    "use strict";

    var tempData;

    _extra.slideManager = {
        "_slideDatas":[],
        "slideNames":[],
        "gotoSlide":function (index) {
            if (typeof index === "string") {
                index = _extra.slideManager.getSlideIndexFromName(index);
            }

            _extra.error("Not defined for Storyline");
        },
        "getCurrentSceneNumber": function() {
            return _extra.storyline.player.currentSlide().sceneIndex;
        },
        "getCurrentSlideNumber": function() {
            return _extra.storyline.player.currentSlide().sceneSlideIndex;
        }
    };

    //_extra.log(_extra.storyline.player.currentSlide());

    for (var i = 0; i < _extra.storyline.slidesData.length; i += 1) {
        tempData = _extra.storyline.slidesData[i];
        _extra.slideManager._slideDatas.push(tempData);
        _extra.slideManager.slideNames.push(tempData.title);
    }


    _extra.slideManager.addEnterSlideEventListener = function (callback) {
        // onnextslide
        // onbeforeslidejump
        // onbeforeslidein
        // ontransitionincomplete
        // onslidestart
        //_extra.error("_extra.slideManager.addEnterSlideEventListener has not been implemented");
        // LOOK IN TO: registerVariableEventSubscriber

        // What's holding this up is finding out how you're supposed to add listeners to these events
    };




}, _extra.STORYLINE);

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
            slideObjectProxies[id] = _extra.factories.createSlideObjectProxy(id, DOMElement);
        }



        return slideObjectProxies[id];

    };

    _extra.slideObjects.doesProxyExistFor = function (slideObjectName) {
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
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 11:15 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectUtilMethods", ["slideObjectManager_global"], function () {

    "use strict";

    function handlePropertyCommand(p1, p2, modelProperty, onlyGetter) {
        // Here are the following possibilities of what's been passed in.
        ////// SET
        // slideObjectName, 100 (number) ---- YES
        // slideObjectName, variable (number) ---- YES
        // slide@Name, 100
        // slide@Name, variable (number)
        // variable, 100
        // variable, variable (number)
        ////// GET
        // variable, slideObjectName ---- YES
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



    };

    _extra.slideObjects.removeEventListener = function (query, event, interactiveObject, criteria) {



    };

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/09/15
 * Time: 4:15 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("softwareInterfacesManager", function () {

    "use strict";

    // References to storyline api
    _extra.storyline = {
        "api":_extra.w.story,
        "variables":_extra.w.story.variables,
        "player":_extra.w.player,
        "slidesData":_extra.w.story.allSlides
    };

    // TODO: Find Storyline Version variable

}, _extra.STORYLINE);
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

        // Save the storage variables when the window closes.
        _extra.w.addEventListener("unload", _extra.variableManager.saveStorageVariables);
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
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/09/15
 * Time: 8:10 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("variableManager", ["softwareInterfacesManager", "Callback"], function () {

    "use strict";
    //var variables = _extra.storyline

    _extra.variableManager = {
        "prefixCallback": new _extra.classes.Callback(),
        "getVariableValue": function (variableName) {
            return _extra.storyline.player.GetVar(variableName);
        },
        "setVariableValue": function (variableName, value) {
            _extra.storyline.player.SetVar(variableName, value);
        },
        "hasVariable": function (variableName) {
            return _extra.storyline.variables.hasOwnProperty(variableName);
        },
        "listenForVariableChange": function (variableName, callback) {
            _extra.error("_extra.variableManager.listenForVariableChange logic has yet to be implemented");
        },
        "stopListeningForVariableChange": function(variableName, callback) {
            _extra.error("_extra.variableManager.stopListeningForVariableChange logic has yet to be implemented");
        }
    };

    return function () {

        var splitName,
            prefix;

        for (var name in _extra.storyline.variables) {
            // TODO: Find a way to extract this so that the Captivate and Storyline versions aren't duplicating the same code.
            if (_extra.storyline.variables.hasOwnProperty(name)) {

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
                _extra.variableManager.prefixCallback.sendToCallback(prefix, name);

            }
        }

        // Dispatch event to let the rest of the modules know the variables have been initialized.
        _extra.eventDispatcher.dispatchEvent(new Event("variablesInitialized"));

    };

}, _extra.STORYLINE);
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/10/15
 * Time: 2:37 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("dataTypeConverters",["globalSlideObjectTypes"], function () {

}, _extra.STORYLINE);
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
_extra.registerModule("slideObjectModelManager", ["slideObjectManager_global", "Model"], function () {

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
        if (_extra.slideManager.hasSlideObjectOnSlide(slideObjectName) && !_extra.slideObjects.doesProxyExistFor(slideObjectName)) {

            _extra.slideObjects.getSlideObjectByName(slideObjectName);

        }
    };

    ////////////////////////////////
    ////////// When moving into a slide with and object that has data in the model
    _extra.slideObjects.enteredSlideChildObjectsCallbacks.addCallback("*", function (slideObjectName) {

        // Do we have data for this in the model?
        if (_extra.slideObjects.model.hasDataFor(slideObjectName) && !_extra.slideObjects.doesProxyExistFor(slideObjectName)) {

            _extra.slideObjects.getSlideObjectByName(slideObjectName);

        }


    });


    // TODO: Handle situation where we update the model for a slide object that hasn't had a proxy made for it.
    // TODO: Handle moving into a slide and creating proxies for all objects with models.
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
 * Time: 7:24 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("stateManager_global",["stateManager_software"],function () {
    "use strict";



});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/10/15
 * Time: 7:24 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("stateManager_software",["Callback","slideObjectManager_global"],function () {
    "use strict";



}, _extra.STORYLINE);
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

    ////////////////////////////////
    ////////// Event Handler
    register("AddEventListener", _extra.slideObjects.addEventListener, handlers.sendParametersAsParameters);
    register("RemoveEventListener", _extra.slideObjects.removeEventListener, handlers.sendParametersAsParameters);



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
        "string":function (string) {

            var data = {};

            data.isSlideObject = _extra.slideObjects.hasSlideObjectInProject(string);
            data.isVariable = _extra.variableManager.hasVariable(string);
            data.isQuery = string.indexOf(_extra.slideObjects.WILDCARD_CHARACTER) !== -1;

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