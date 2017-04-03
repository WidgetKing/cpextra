/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/11/15
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("commandVariables_software", ["commandVariables_global", "actionManager", "TOCManager"], function () {

    "use strict";

    var register = _extra.variableManager.registerCommandVariable,
        handlers = _extra.variableManager.parameterHandlers;

    ////////////////////////////////
    ////////// Event Handler
    register("AddEventListener", _extra.slideObjects.addEventListener, handlers.sendParametersAsParameters);
    register("RemoveEventListener", _extra.slideObjects.removeEventListener, handlers.sendParametersAsParameters);

}, _extra.CAPTIVATE);