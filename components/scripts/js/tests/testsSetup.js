/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 25/09/15
 * Time: 8:35 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";
    window.unitTests = {
        "CAPTIVATE":"cp",
        "STORYLINE":"sl"
    };
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
    window._extra = window.unitTests;

}());
