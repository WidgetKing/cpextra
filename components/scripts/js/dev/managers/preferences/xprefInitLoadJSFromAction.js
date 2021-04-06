_extra.registerModule(
  "xprefInitLoadJSFromAction",
  ["jsLoadManager", "commandVariableManager", "variableManager_software"],
  function () {
    "use strict";

    return function () {

      function loadFilesNow(value) {
        var params = _extra.variableManager.prepareParameters(value);
        if (params) params.forEach(_extra.jsLoadManager.loadFromAction);
      };

      var VARIABLE_NAME = "xprefInitLoadJSFromAction";

      if (_extra.variableManager.hasVariable(VARIABLE_NAME)) {
        loadFilesNow(
          _extra.variableManager.getVariableValue(VARIABLE_NAME)
        );
      }

    }
  }
);
