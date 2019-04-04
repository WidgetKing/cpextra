_extra.registerModule("movie", ["variableManager_software"], function () {

  _extra.movie = {

    "pause": function () {
      _extra.variableManager.setVariableValue("cpCmndPause", 1)
    },

    "play": function () {
      _extra.variableManager.setVariableValue("cpCmndResume", 1)
    }

  }

});
