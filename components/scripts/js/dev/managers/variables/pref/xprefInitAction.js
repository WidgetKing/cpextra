/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/04/17
 * Time: 2:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule(
  "xprefInitAction",
  ["slideManager_global", "preferenceManager"],
  function() {
    "use strict";

    // This variable calls an action right at the start of the movie, no matter whether that movie starts
    // on the first slide, or jumps into the middle due to self-paced learning/LMS/whatever
    var VARIABLE_NAME = "xprefInitAction";
    var hasXPrefInitBeenCalled = false;

    ////////////////////////////////////////
    ////// assistant methods
    function callAllMethodsInArray(array) {
      array.forEach(function(method) {
        method();
      });
    }

    ////////////////////////////////////////
    ////// entry point

    function entryPoint() {
      _extra.slideManager.enterSlideCallback.removeCallback("*", entryPoint);

      if (_extra.variableManager.hasVariable(VARIABLE_NAME)) {
        var result = _extra.variableManager.getVariableValue(VARIABLE_NAME);
        result = _extra.variableManager.prepareParameters(result);

        if (result) {
          if (_extra.variableManager.commands.callActionOn) {
            // We need to do this through the command variables
            // So that we'll get the automatic 'success' criteria property.
            _extra.variableManager.commands.callActionOn(result[0], result[1]);
          } else {
            console.error(
              "The command variables have not been initialized for some reason"
            );
          }
        }
      }

      // Callbacks wanting to execute after
      // xprefInitAction
      hasXPrefInitBeenCalled = true;
      callAllMethodsInArray(callbacks);
      // Unload
      callbacks = null;
    }

    _extra.slideManager.enterSlideCallback.addCallback("*", entryPoint);

    ////////////////////////////////////////
    ////// Call after xprefInit
    // Used by xprefStartSlide
    var callbacks = [];

    _extra.preferenceManager.callAfterXprefInitAction = function(method) {
      if (hasXPrefInitBeenCalled) {
        method();
      } else {
        callbacks.push(method);
      }
    };
  }
);
