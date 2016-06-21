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
    ////////// Hide

    _extra.variableManager.commands.hide = function (query) {
        _extra.variableManager.parseSets.SP.CD.SOR(query, _extra.slideObjects.hide);
    };

    _extra.variableManager.commands.show = function (query) {
        _extra.variableManager.parseSets.SP.CD.SOR(query, _extra.slideObjects.show);
    };

    _extra.variableManager.commands.enable = function (query) {
        _extra.variableManager.parseSets.SP.CD.SOR(query, _extra.slideObjects.enable);
    };

    _extra.variableManager.commands.disable = function (query) {
        _extra.variableManager.parseSets.SP.CD.SOR(query, _extra.slideObjects.disable);
    };

    _extra.variableManager.commands.changeState = function (query, stateName) {

        _extra.variableManager.parseSets.MP.SOR_STR(query, stateName, function (slideObjectName, stateName) {
            _extra.slideObjects.states.change(slideObjectName, stateName);
        });

    };


    register("Hide", _extra.variableManager.commands.hide);
    register("Show", _extra.variableManager.commands.show);
    register("Enable", _extra.variableManager.commands.enable);
    register("Disable", _extra.variableManager.commands.disable);

    register("ChangeState", _extra.variableManager.commands.changeState, handlers.sendParametersAsParameters);


});