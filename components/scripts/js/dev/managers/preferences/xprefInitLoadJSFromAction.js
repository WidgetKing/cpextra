_extra.registerModule(
  "xprefInitLoadJSFromAction",
  ["jsLoadManager", "commandVariableManager", "preferenceManager"],
  function() {
    "use strict";

    var info = {
      enable: function() {},

      disable: function() {}
    };

    window.TEST_HANDLE = function(value) {
      var params = _extra.variableManager.prepareParameters(value);
      if (params) params.forEach(_extra.jsLoadManager.loadFromAction);
    };

    var exists = _extra.preferenceManager.regiseterPreferenceModule(
      "InitLoadJSFromAction",
      info
    );

    if (exists) {
      window.TEST_HANDLE(
        _extra.variableManager.getVariableValue("xprefInitLoadJSFromAction")
      );
    }
  }
);
