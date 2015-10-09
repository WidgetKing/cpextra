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

    };

    function instantiateBehaviourModule(behaviourVariable) {
        var module = behaviourModules[behaviourVariable];
        if (!module.instantiated) {
            module.moduleConstructor();
            module.instantiated = true;
        }
    }

    _extra.behaviourManager.registerBehaviourModule = function (behaviourVariableSuffix, moduleConstructor, onLoadFunction) {
        var behaviourVariable = behaviourVariablePrefix + behaviourVariableSuffix,
            info = {};
        if (behaviourModules[behaviourVariable]) {
            // We already have a behaviour module of this type.
            throw new Error("Illegally attempted to register two behaviour modules with the name: " + behaviourVariableSuffix);
        }

        info.moduleConstructor = moduleConstructor;
        info.instantiated = false;
        info.onLoadCallback = onLoadFunction;

        behaviourModules[behaviourVariable] = info;

        if (!_extra.variableManager.hasVariable(behaviourVariable)) {
            instantiateBehaviourModule(behaviourVariable);
        }
    };

});