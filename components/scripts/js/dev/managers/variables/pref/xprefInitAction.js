/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/04/17
 * Time: 2:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("xprefInitAction", ["slideManager_global"], function () {

    "use strict";

    // This variable calls an action right at the start of the movie, no matter whether that movie starts
    // on the first slide, or jumps into the middle due to self-paced learning/LMS/whatever
    var VARIABLE_NAME = "xprefInitAction";

    function entryPoint () {

        _extra.slideManager.enterSlideCallback.removeCallback("*", entryPoint);

        if (_extra.variableManager.hasVariable(VARIABLE_NAME)) {

            var result = _extra.variableManager.getVariableValue(VARIABLE_NAME);
            result = _extra.variableManager.prepareParameters(result);

            if (result) {

                _extra.variableManager.commands.callActionOn(result[0], result[1]);

            }

        }

    }

    _extra.slideManager.enterSlideCallback.addCallback("*", entryPoint);

});