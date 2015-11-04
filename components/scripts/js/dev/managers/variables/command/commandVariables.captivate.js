/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/11/15
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("commandVariables_software", ["commandVariableManager", "advancedActionManager"], function () {

    "use strict";

    // Note: This doesn't work with @ syntax
    _extra.variableManager.registerCommandVariable("CallActionOn", _extra.advancedActionManager.callActionOn,
                                                       _extra.variableManager.parameterHandlers.sendParametersAsParameters);

}, _extra.CAPTIVATE);