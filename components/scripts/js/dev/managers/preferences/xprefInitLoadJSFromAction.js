_extra.registerModule(
  "xprefInitLoadJSFromAction",
  ["jsLoadManager", "queryManager", "commandVariableManager", "variableManager_software"],
  function () {
    "use strict";

    return function () {

      var R = _extra.utils;

      function loadFilesNow(value) {
        var params = _extra.variableManager.prepareParameters(value);
        if (!params) return;
        
        R.pipe(
          R.flatMap(replaceAtSyntax),
          R.forEach(R.__, _extra.jsLoadManager.loadFromAction)
        )(params);

      };

      function replaceAtSyntax (query) {

        if (!_extra.isQuery(query)) return query;
        if (_extra.isLocalQuery(query)) {

          _extra.error("CV081", query)
          // TODO: Warning about using local query
          return null;
        }

        return _extra.slideObjects.getSlideObjectNamesMatchingWildcardName(query);

      }

      window.test = replaceAtSyntax;


      var VARIABLE_NAME = "xprefInitLoadJSFromAction";

      if (_extra.variableManager.hasVariable(VARIABLE_NAME)) {
        loadFilesNow(
          _extra.variableManager.getVariableValue(VARIABLE_NAME)
        );
      }

    }
  }
);
