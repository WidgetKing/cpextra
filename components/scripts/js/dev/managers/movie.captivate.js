_extra.registerModule(
  "movie",
  ["variableManager_software", "softwareInterfacesManager", "hookManager"],
  function() {
    ////////////////////////////////////////
    ////// variables
    var _lastReasonForPause;

    ////////////////////////////////////////
    ////// Object

    _extra.movie = {
      pause: function(reasonForPause) {

		  // Parameter default.
        if (!reasonForPause)
          reasonForPause = _extra.movie.reasonsForPause.CPCMNDPAUSE;
		  
		  // Pause
        _extra.captivate.api.movie.pause(reasonForPause);
        // Previously we did this by setting the  cpCmndPause variable
        // Now we're trying the above way so that we can set the reason
        // for pause more specifically.
        // _extra.variableManager.setVariableValue("cpCmndPause", 1);
      },

      pauseIfNotPaused: function(reasonForPause) {
        if (!_extra.movie.paused) _extra.movie.pause(reasonForPause);
      },

      play: function() {
        _extra.variableManager.setVariableValue("cpCmndResume", 1);
      },

      reasonsForPause: {
        PLAYBAR_ACTION: 0,
        INTERACTIVE_ITEM: 1,
        MOVIE_ENDED: 2,
        VIDEO_SYNC: 3,
        FEEDBACK_ITEM: 4,
        CANNOT_MOVE_AHEAD: 5,
        WAIT_FOR_RESOURCES: 6,
        MOVIE_REWIND_STOP: 7,
        CPCMNDPAUSE: 8,
        SHOW_VALUE_AT_FRAME: 9,
        DONT_CARE_DEPRECATED_CODE: 10,
        EVENT_VIDEO_PAUSE: 11,
        ONLY_ONE_MEDIUM_CAN_PLAY: 12,
        PPTX_PAUSE_FOR_ONCLICK_ANIMATION: 13,
        CPCMNDGOTOFRAME: 14,
        BAD_ORIENTATION: 15,
        WK_EXIT_FULL_SCREEN: 16,
        ACTION_CHOICE: 17,
        XPREFENSURECPMATELOAD: 99
      }
    };

    ////////////////////////////////////////
    ////// getters/setters
    _extra.w.Object.defineProperty(_extra.movie, "paused", {
      get: function() {
        return _extra.captivate.movie.paused;
      }
    });

    _extra.w.Object.defineProperty(_extra.movie, "lastReasonForPause", {
      get: function() {
        return _lastReasonForPause;
      }
    });

    ////////////////////////////////////////
    ////// Functionality

    _extra.addHookBefore(_extra.captivate.api.movie, "pause", function(
      reasonForPause
    ) {
      _lastReasonForPause = reasonForPause;
    });
  }
);
