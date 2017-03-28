/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 22/03/16
 * Time: 4:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("existingActionCommandVariables", ["queryManager", "slideObjectManager_global",
                                                         "variableManager", "commandVariableManager"], function () {

    "use strict";

    var register = _extra.variableManager.registerCommandVariable,
        handlers = _extra.variableManager.parameterHandlers;

    ////////////////////////////////
    ////////// Extend Captivate Functions

    /*function checkForVariable(parameter, finalMethod) {

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
    }*/


    ////////////////////////////////
    ////////// Hide
    /*register("Hide", function (parameter) {
        checkForVariable(parameter, _extra.slideObjects.hide);
    });
    ////////////////////////////////
    ////////// Show
    register("Show", function (parameter) {
        checkForVariable(parameter, _extra.slideObjects.show);
    });*/

    _extra.variableManager.commands.hide = function (query) {
        _extra.variableManager.parseSets.SP.CD.SOR(query, _extra.slideObjects.hide);
    };

    _extra.variableManager.commands.show = function (query) {
        _extra.variableManager.parseSets.SP.CD.SOR(query, _extra.slideObjects.show);
    };


    _extra.variableManager.commands.changeState = function (query, stateName) {

        _extra.variableManager.parseSets.MP.SOR_STR(query, stateName, function (slideObjectName, stateName) {
            _extra.slideObjects.states.change(slideObjectName, stateName);
        });

    };

    _extra.variableManager.commands.preventTabOut = function (query) {

        _extra.variableManager.parseSets.SP.CD.SOR(query, _extra.focusManager.lockFocusTo);

    };

    _extra.variableManager.commands.allowTabOut = function (query) {

        _extra.variableManager.parseSets.SP.CD.SOR(query, _extra.focusManager.unlockFocusFrom);

    };


    register("Hide", _extra.variableManager.commands.hide);
    register("Show", _extra.variableManager.commands.show);
    register("Enable", _extra.variableManager.commands.enable);
    register("Disable", _extra.variableManager.commands.disable);

    register("ChangeState", _extra.variableManager.commands.changeState, handlers.sendParametersAsParameters);

    register("PreventTabOut", _extra.variableManager.commands.preventTabOut);
    register("AllowTabOut", _extra.variableManager.commands.allowTabOut);
});
