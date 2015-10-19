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
        "build":"1113"
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
 * Date: 24/09/15
 * Time: 1:30 PM
 * To change this template use File | Settings | File Templates.
 */

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

    };

}, _extra.STORYLINE);
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

    _extra.slideManager.getSlideData = function (index) {
        if (typeof index === "string") {
            index = _extra.slideManager.getSlideIndexFromName(index);
        }

        if (index === -1) {
            return null;
        } else {
            return new _extra.classes.SlideDataProxy(_extra.slideManager._slideDatas[index]);
        }
    };

    _extra.slideManager.getSlideIndexFromName = function (name) {
        return _extra.slideManager.slideNames.indexOf(name);
    };

    // TODO: Define: play, pause, gotoPreviousSlide, gotoNextSlide, currentSlideNumber
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 2:04 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideManager_software", ["softwareInterfacesManager"], function () {

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
        }
    };


    for (var i = 0; i < _extra.storyline.slidesData.length; i += 1) {
        tempData = _extra.storyline.slidesData[i];
        _extra.slideManager._slideDatas.push(tempData);
        _extra.slideManager.slideNames.push(tempData.title);
    }





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

    var slideObjectProxies = {};

    _extra.slideObjects.WILDCARD_CHARACTER = "@";
    _extra.slideObjects.getSlideObjectProxy = function (id) {

        var DOMElement;

        // If we were passed in a DOM element rather than the id of a DOM element...
        if (typeof id === "object") {
            DOMElement = id;
            id = DOMElement.id;
        } else {
            // We were given the id of a dom element, so we have to find it.
            _extra.w.document.getElementById(id);
        }

        if (!slideObjectProxies[id]) {
            slideObjectProxies[id] = _extra.factories.createSlideObjectProxy(id, DOMElement);
        }

        return slideObjectProxies[id];

    };

    // TODO: Should clear slideObjectProxies when entering a new slide.
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
 * Date: 27/09/15
 * Time: 8:10 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("generalVariableManager", ["softwareInterfacesManager", "Callback"], function () {

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
            return _extra.storyline.variables[variableName] !== undefined;
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