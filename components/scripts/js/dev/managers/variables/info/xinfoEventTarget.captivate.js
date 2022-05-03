/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 22/03/16
 * Time: 3:34 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("xinfoEventTarget", ["infoVariableManager", "eventManager", "hookManager"], function () {

    "use strict";

    var info = {
        "suffix": "EventTarget"
    };


    if (_extra.infoManager.registerInfoVariable(info)) {

        _extra.addHookBefore(_extra.eventManager, "setEventTarget", function (eventTarget) {

            // Whenever the current event target is changed, we'll update the xinfoEventTarget variable.
            _extra.variableManager.setVariableValue(info.name, eventTarget);

        });

    }


}, _extra.CAPTIVATE);