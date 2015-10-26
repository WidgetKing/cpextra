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
        if (console) {
            console.log(message);
        }
    };


    /**
     * Send an error to the debug console of the browser, assuming the console is available.
     * @param message
     */
    _extra.error = function (message) {
        if (console) {
            console.error(message);
        }
    };

    // The highest window, where we should be able to find the internal functions of the output
    _extra.w = topWindow.parent;

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

    //////////////
    ///// Define the public API
    //////////////
    _extra.X = {
        "version":"0.0.2",
        "build":"1539"
    };

    //////////////
    ///// Call on load callbacks
    //////////////
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


    //////////////
    ///// Listen for Storyline Initialization
    //////////////
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
    //////////////
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
        this.clear = function () {
            this.data = {};
        };
    });
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
            previousNormalState = "Normal";

        this.slideObject = slideObject;
        this.data = data;



        ///////////////////////////////////////////////////////////////////////
        /////////////// Variable Validity
        ///////////////////////////////////////////////////////////////////////
        function findStateWithValidVariables(shouldEvaluate, stateData) {
            if (shouldEvaluate) {

                //var stateCondition;

                for (var stateName in stateData) {
                    if (stateData.hasOwnProperty(stateName)) {

                        slideObject.changeState(stateName);
                        return true;

                    }
                }

            }

            return false;
        }

        function evaluateState() {

            if (!findStateWithValidVariables(isMouseDown, data.d)) {
                if (!findStateWithValidVariables(isMouseOver, data.r)) {

                    if (!findStateWithValidVariables(true, data.n)) {

                        slideObject.changeState(previousNormalState);
                        // TODO: Switch to the last normal state
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





        ///////////////////////////////////////////////////////////////////////
        /////////////// Kick off
        ///////////////////////////////////////////////////////////////////////
        if (data.r) {
            slideObject.addEventListener("mouseover", this.onRollover);
        }

        if (data.d) {
            slideObject.addEventListener("mousedown", this.onMouseDown);
        }

        // TODO: evaluateState here in order to check variables that have already been set.
    }

    SlideObjectStateManager.prototype.unload = function () {
        this.slideObject.removeEventListener("mouseover", this.onRollover);
        this.slideObject.removeEventListener("mouseout", this.onRollout);
        this.slideObject.removeEventListener("mousedown", this.onMouseDown);
        _extra.w.document.removeEventListener("mouseup", this.onMouseUp);

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

                var rawStatesArray = this._data.base.stl;

                for (var i = 0; i < rawStatesArray.length; i += 1) {

                    this._states.push(rawStatesArray[i].stn);

                }
            }

            return this._states;
        }
    };

    //BaseSlideObjectData.prototype.get

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
        _extra.slideObjects.changeState(this.name, stateName);
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
        }
    };



    _extra.registerClass("SlideDataProxy", SlideDataProxy, _extra.CAPTIVATE);

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
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/10/15
 * Time: 5:06 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("behaviourManager", ["generalVariableManager"], function () {

    "use strict";
    var behaviourVariablePrefix = "xbehavior";
    var behaviourModules = {};


    _extra.behaviourManager = {

        /**
         * Takes information for a behaviour module and enables it at the appropriate time.
         *
         * A behaviour module is a part of Extra which has been built to change the default behaviour of the target software.
         *
         * Examples include, stopping TextEntryBoxes from being blank when they first appear, thereby preventing their variables
         * from losing their values needlessly.
         * @param behaviourVariableSuffix
         * @param behaviourInfo
         * @returns {boolean}
         */
            "registerBehaviourModule": function (behaviourVariableSuffix, behaviourInfo) {

            // What the name for the variable that manages this behaviour should look like.
            var behaviourVariable = behaviourVariablePrefix + behaviourVariableSuffix;

            function onBehaviourVariableChange () {

                if (_extra.variableManager.getVariableValue(behaviourVariable)) {

                    if (!behaviourInfo.enabled) {
                        behaviourInfo.enable();
                        behaviourInfo.enabled = true;
                    }

                } else {

                    if (behaviourInfo.enabled) {
                        behaviourInfo.disable();
                        behaviourInfo.enabled = false;
                    }

                }
            }

            // Now check to see if a variable has been defined to manage this behaviour. If it has, then we will save this
            // behaviour.

            if (!_extra.variableManager.hasVariable(behaviourVariable)) {
                // Check to see if the behaviour variable has been defined with an underscore at the front of its name.
                behaviourVariable = "_" + behaviourVariable;
                if (!_extra.variableManager.hasVariable(behaviourVariable)) {
                    // Show the behaviour module that there is no variable defined to manage the behaviour and it is therefore
                    // unneccesary to instantiate.
                    return false;
                }
            }


            // Check validity of passed in information.
            if (behaviourModules[behaviourVariable]) {
                // We already have a behaviour module of this type.
                throw new Error("Illegally attempted to register two behaviour modules with the name: " + behaviourVariableSuffix);
            } else if (!behaviourInfo.enable) {
                throw new Error("Illegally tried to submit a behaviour module without an enable method specified in the behaviourInfo parameter object.");
            } else if (!behaviourInfo.disable) {
                throw new Error("Illegally tried to submit a behaviour module without a disable method specified in the behaviourInfo parameter object.");
            }

            // Save behaviour
            behaviourModules[behaviourVariable] = behaviourInfo;
            behaviourInfo.enabled = false;



            // Every time the behaviour variable changes, we'll make sure the module is enabled or disabled accordingly.
            _extra.variableManager.listenForVariableChange(behaviourVariable, onBehaviourVariableChange);

            // We'll also enable or disable
            onBehaviourVariableChange();

            // Let the module know there is a variable set up to manage the behaviour and it is therefore approved to
            // continue instantiation
            return true;

        }
    };

});
/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("preventTextEntryBoxOverwrite", ["generalSlideObject_global", "behaviourManager", "eventManager"], function () {
    "use strict";

    ///////////////////////
    ////////// Private Variables
    ///////////////////////

    var hasCollectedTextBoxData = false,
        textEntryBoxData = {},
        areVariablesInitliazed = false,
        behaviourModuleInfo = {
            // Automatically called by _extra.behaviourManager in response to the value of the xbehaviourPreventTextEntryBoxOverwrite variable
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
        _extra.eventDispatcher.removeEventListener("variablesInitialized", onVariablesInit);
        areVariablesInitliazed = true;
        if (behaviourModuleInfo.enabled) {
            for (var textEntryBoxName in textEntryBoxData) {
                if (textEntryBoxData.hasOwnProperty(textEntryBoxName)) {
                    enableVariable(textEntryBoxName);
                }
            }
        }
    }

    _extra.eventDispatcher.addEventListener("variablesInitialized", onVariablesInit);

    ///////////////////////
    ////////// Initialization
    ///////////////////////

    if (_extra.behaviourManager.registerBehaviourModule("PreventTextEntryBoxOverwrite", behaviourModuleInfo)) {



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

        _extra.X.getSlideData = _extra.slideManager.getSlideData;
        _extra.X.gotoSlide = _extra.slideManager.gotoSlide;
        _extra.X.getSlideObjectByName = _extra.slideObjects.getSlideObjectByName;
        _extra.X.hide = _extra.slideObjects.hide;
        _extra.X.show = _extra.slideObjects.show;
        _extra.X.disable = _extra.slideObjects.disable;
        _extra.X.enable = _extra.slideObjects.enable;
        _extra.X.changeState = _extra.slideObjects.changeState;
    };
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

    /**
     * This function takes a query, converts it into a list of slide objects, then applies a function to those slide objects.
     *
     * Useful for enhancing Captivate's own internal show, hide, and enable, disable functions.
     */
    function enactFunctionOnSlideObjects(query, method) {
        if (query.indexOf(_extra.slideObjects.WILDCARD_CHARACTER) > -1) {

            var list = _extra.slideObjects.getSlideObjectNamesMatchingWildcardName(query, false);

            for (var i = 0; i < list.length; i += 1) {

                method(list[i]);

            }

        } else {

            method(query);

        }
    }

    _extra.slideObjects = {
        "allObjectsOfTypeCallback": new _extra.classes.Callback(),
        "getSlideObjectElement": function(id) {
            return _extra.w.document.getElementById("re-" + id + "c");
        },
        "hide":function (query) {
            enactFunctionOnSlideObjects(query, _extra.captivate.api.hide);
        },
        "show":function (query) {
            enactFunctionOnSlideObjects(query, _extra.captivate.api.show);
        },
        "enable":function (query) {
            enactFunctionOnSlideObjects(query, _extra.captivate.api.enable);
        },
        "disable":function (query) {
            enactFunctionOnSlideObjects(query, _extra.captivate.api.disable);
        },
        "changeState":function (query, state) {
            enactFunctionOnSlideObjects(query, function (slideObjectName) {
                _extra.captivate.api.changeState(slideObjectName, state);
            });
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
            slideObjectProxies[id] = _extra.factories.createSlideObjectProxy(id, DOMElement);
        }

        return slideObjectProxies[id];

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

        // Clear the proxy list as we are on a new slide with new objects
        slideObjectProxies = {};

        var slideObjectsData = _extra.slideManager.getSlideData(),
            slideObjectName;



        for (var i = 0; i < slideObjectsData.slideObjects.length; i += 1) {
            slideObjectName = slideObjectsData.slideObjects[i];

            _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback("*", slideObjectName);

        }

    });
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
 * Date: 20/10/15
 * Time: 9:38 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("commandVariables",["generalVariableManager","slideObjectManager_global"], function () {

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
    /////////////// LIST OF COMMAND VARIABLES
    ///////////////////////////////////////////////////////////////////////
    _extra.variableManager.registerCommandVariable("Hide", _extra.slideObjects.hide);
    _extra.variableManager.registerCommandVariable("Show", _extra.slideObjects.show);
    _extra.variableManager.registerCommandVariable("Enable", _extra.slideObjects.enable);
    _extra.variableManager.registerCommandVariable("Disable", _extra.slideObjects.disable);

    _extra.variableManager.registerCommandVariable("ChangeState", _extra.slideObjects.changeState,
                                                   _extra.variableManager.parameterHandlers.sendParametersAsParameters);




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
/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/09/15
 * Time: 9:02 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("generalVariableManager", ["softwareInterfacesManager", "Callback"], function () {
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
        _extra.eventDispatcher.dispatchEvent(new Event("variablesInitialized"));

    };

}, _extra.CAPTIVATE);
/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 12:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("localStorageManager", ["generalVariableManager"], function () {

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
 * Date: 15/10/15
 * Time: 2:04 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideManager_software", ["softwareInterfacesManager", "Callback"], function () {

    "use strict";

    var slideIDs = _extra.captivate.model.data.project_main.slides.split(","),
        tempBaseData,
        tempContainerData;

    _extra.slideManager = {
        "_slideDatas": [],
        "slideNames": [],
        "currentSlideDOMElement":_extra.w.document.getElementById("div_Slide"),
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
        }
    };


    ////////////////////////////////
    ////////// slideNames Array Setup

    slideIDs.forEach(function(slideID){
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
        _extra.captivate.eventDispatcher.addEventListener(_extra.captivate.events.SLIDE_ENTER, callback);
    };


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
 * Date: 20/10/15
 * Time: 4:24 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("registerStateMetaData",["slideObjectManager_global", "SlideObjectStateManager", "slideManager_global"], function () {

    "use strict";

    var stateManagers = {},
        ROLLOVER = "r",
        MOUSEDOWN = "d",
        NORMAL = "n";

    _extra.slideObjects.states = {

        ///////////////////////////////////////////////////////////////////////
        /////////////// Register States for Automatic Switching
        ///////////////////////////////////////////////////////////////////////
        registerStateMetaData: function (slideObjectName, data) {

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
                throw new Error("At _extra.slideObjects.states.registerStateMetaData, tried to register data for '" + slideObjectName + "' twice. " +
                "Has unloading of this data from a previous slide been unsuccessful?");

            }


            slideObjectProxy = _extra.slideObjects.getSlideObjectByName(slideObjectName);
            currentSlideStateManagers[slideObjectName] = new _extra.classes.SlideObjectStateManager(slideObjectProxy, data);
        },
        "isAutomaticallyChangingStates":function (comparisonName) {

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

        }
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

        // TODO: Unload the stateManagers from the previous slide.

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
                segment;

            // There are multiple places in the loop below where we might want to register a variable, so we abstract
            // that functionality into a function.
            function registerVariable(variableName) {

                // x_var_var
                if (variableData.hasOwnProperty(variableName)) {

                    throw new Error("State name '" + fullName + "' illegally tried to register '" + variableName + "' twice.");

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

                    // x_var
                    if (_extra.variableManager.hasVariable(segment)) {
                        registerVariable(segment);
                    // x_invalidVar
                    } else {
                        throw new Error("Could not find variable by the name of '" + segment + "' as present in state name: '" + fullName + "'");
                    }

                    // If the previous index was a value, then this index MUST be a variable.
                    previousIndexVariable = segment;
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