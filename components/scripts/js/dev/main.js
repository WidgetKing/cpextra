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
        "version":"$$VERSION_NUMBER$$",
        "build":"$$BUILD_NUMBER$$"
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