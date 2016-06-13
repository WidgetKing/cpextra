/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 22/03/16
 * Time: 4:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("existingActionCommandVariables", ["queryManager", "slideObjectManager_global", "variableManager", "commandVariableManager"], function () {

    "use strict";

    var register = _extra.variableManager.registerCommandVariable,
        handlers = _extra.variableManager.parameterHandlers;
    ////////////////////////////////
    ////////// Extend Captivate Functions

    function checkForVariable(parameter, finalMethod) {

        // Replacing variables with their actual values.
        if (_extra.variableManager.hasVariable(parameter)) {
            parameter = _extra.variableManager.getVariableValue(parameter);
        }

        // If this isn't a query then we want to make sure it's a valid slide object.
        if (!_extra.isQuery(parameter) && !_extra.slideObjects.hasSlideObjectInProject(parameter)) {
            _extra.error("CV001", parameter);
            return;
        }

        finalMethod(parameter);
    }

    ////////////////////////////////
    ////////// Hide
    register("Hide", function (parameter) {
        checkForVariable(parameter, _extra.slideObjects.hide);
    });
    ////////////////////////////////
    ////////// Show
    register("Show", function (parameter) {
        checkForVariable(parameter, _extra.slideObjects.show);
    });

    ////////////////////////////////
    ////////// Enable
    register("Enable", function (parameter) {
        checkForVariable(parameter, _extra.slideObjects.enable);
    });
    ////////////////////////////////
    ////////// Disable
    register("Disable", function (parameter) {
        checkForVariable(parameter, _extra.slideObjects.disable);
    });

    //register("ChangeState", _extra.slideObjects.states.change, handlers.sendParametersAsParameters);
    register("ChangeState", function (slideObjectName, stateName) {

        checkForVariable(slideObjectName, function (result) {
            _extra.slideObjects.states.change(result, stateName);
        });

    }, handlers.sendParametersAsParameters);

});