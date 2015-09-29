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
        "getCaptivateMockObject": function () {
            return {
                "w": {
                    "cp": {
                        "model": {

                        }
                    },
                    "cpAPIInterface": {

                    },
                    "cpAPIEventEmitter": {

                    },
                    "CaptivateVersion":"9.0.0",
                    "cpInfoCurrentSlide":1,
                    "ls_localStorage":"local_storage_value",
                    "ss_sessionStorage":"session_storage_value"
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
                        }
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
    unitTests.registerClass = function (className, classConstructor, SuperClass) {

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

    window._extra = window.unitTests;

}());
