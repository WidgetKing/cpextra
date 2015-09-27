/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 25/09/15
 * Time: 8:35 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";
    window.unitTests = {};
    unitTests.modules = {};
    unitTests.initModule = function(moduleName, moduleDependencies, moduleConstructor) {
        unitTests.modules[moduleName] = moduleConstructor;
    };
    window._extra = window.unitTests;

}());
