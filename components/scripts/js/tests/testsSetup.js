/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 25/09/15
 * Time: 8:35 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    /////////////////
    ///// Global unit tests object
    /////////////////
    window.unitTests = {
        "CAPTIVATE":"captivate",
        "STORYLINE":"storyline",
        "createVariableGetterSetter":function (root, variableObject) {

            root.getVariableValue = jasmine.createSpy("variableManager.getVariableValue", function (name) {
                return variableObject[name];
            }).and.callThrough();

            root.setVariableValue = jasmine.createSpy("variableManager.setVariableValue", function (name, value) {
                variableObject[name] = value;
            }).and.callThrough();

            root.hasVariable = jasmine.createSpy("variableManager.hasVariable", function (name) {
                return variableObject.hasOwnProperty(name);
            }).and.callThrough();

        },

        "getModule": function (name, software) {
            if (software) {
                return unitTests.modules[name + "_" + software];
            } else {
                return unitTests.modules[name];
            }

        },
        "getCaptivateMockObject": function () {
            return {
                "classes":unitTests.classes,
                "w": {
                    "cp": {
                        "D":{
                            "project_main":{

                            }
                        },
                        "model": {

                        },
                        "movie":{

                        }
                    },
                    "cpAPIInterface": {

                    },
                    "cpAPIEventEmitter": {

                    },
                    "CaptivateVersion":"9.0.0",
                    "cpInfoCurrentSlide":1,
                    "ls_localStorage":"local_storage_value",
                    "ss_sessionStorage":"session_storage_value",
                    "Object":Object,
                    "Array":Array,
                    "parseInt":parseInt,
                    "parseFloat":parseFloat,
                    "isNaN":isNaN,
                    "document":document
                },
                "log": function () {

                }
            };
        },
        "getStorylineMockObject": function () {
            return {
                "w": {
                    "story": {
                        "variables":{
                            "ls_localStorage":"local_storage_value",
                            "ss_sessionStorage":"session_storage_value"
                        },
                        "allSlides":[
                            {

                            }
                        ]
                    },
                    "player": {

                    }
                },
                "log":function () {

                }
            };
        }
    };

    // TODO: Refactor this into the object above.
    unitTests.modules = {};
    unitTests.registerModule = function(moduleName, moduleDependencies, moduleConstructor, softwareType) {

        if (typeof moduleDependencies === "function") {

            if (typeof moduleConstructor === "string") {
                softwareType = moduleConstructor;
            }

            moduleConstructor = moduleDependencies;

        }

        if (softwareType) {
            unitTests.modules[moduleName + "_" + softwareType] = moduleConstructor;
        } else {
            unitTests.modules[moduleName] = moduleConstructor;
        }
    };
    unitTests.classes = {};
    unitTests.softwareClasses = {};
    unitTests.registerClass = function (className, classConstructor, SuperClass, software) {

        // If we've passed in the software as the third parameter instead of the fourth
        if (!software && SuperClass === unitTests.CAPTIVATE || SuperClass === unitTests.STORYLINE) {
            software = SuperClass;
            SuperClass = null;
        }

        //alert("Register Class\nclassName: " + className + "\nclassSoftware: " + software);

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

        if (software) {

            //alert("Registered class as belonging to: " + software);

            if (!unitTests.softwareClasses[className]) {
                unitTests.softwareClasses[className] = {};
            }

            unitTests.softwareClasses[className][software] = classConstructor;

        }
        _extra.classes[className] = classConstructor;
    };

    /**
     * Some of the classes we build have a Captivate version and a Storyline version. These will need to be instantiated
     * by certain managers. So to make sure the storyline manager won't instantiate the captivate class, we have this function
     * to designate which version of the class is available on the unitTests.classes object.
     * @param className
     * @param software Which software version of the class should be assigned to unitTests.classes
     */
    unitTests.setSoftwareClassAsMain = function (className, software) {
        unitTests.classes[className] = unitTests.softwareClasses[className][software];
    };

    window._extra = window.unitTests;

}());
