_extra.registerModule(
  "xprefEnsureWebObjectLoad",
  ["slideObjectManager_global", "utils"],
  function() {
    "use strict";
    ////////////////////////////////////////
    ////// variables
    var callback = _extra.slideObjects.enteredSlideChildObjectsCallbacks;
    // We can dream of Ramda...
    var R = _extra.utils;
    var enabled = false;
    var waitList = [];

    ////////////////////////////////////////
    ////// assist functions
    function listen() {
      callback.addCallback(
        _extra.dataTypes.slideObjects.WEB_OBJECT,
        onNewWebObject
      );
    }

    ////////////////////////////////////////
    ////// Preference object

    var preferenceData = {
      enable: function() {
        enabled = true;
      },

      disable: function() {
        enabled = false;
      },

      default: false
    };
    ////////////////////////////////////////
    ////// Wait list
    function getWaitList() {
      return waitList;
    }
    function setWaitList(list) {
      waitList = list;
    }

    var addToWaitList = function(slideObjectName) {
      return R.pipe(
        R.append(slideObjectName),
        R.tap(setWaitList),
        // Pause the movie
        _extra.movie.pause
      )(getWaitList());
    };

    var removeFromWaitList = function(slideObjectName) {
      return R.pipe(
        R.without([slideObjectName]),
        R.tap(setWaitList),
        R.when(
          // Condition: List empty
          R.pipe(
            R.length,
            R.equals(0)
          ),
          // Play the movie
          R.pipe(_extra.movie.play)
        )
      )(getWaitList());
    };

    ////////////////////////////////////////
    ////// handleLoading

    var onEnter = function(onEnter, slideObject) {
      var onEnterHandler = R.pipe(
        R.always(slideObject),
        R.tap(function() {
          slideObject.removeEventListener("enter", onEnter);
        }),
        R.unless(R.prop("isLoaded"), onEnter)
      );

      return slideObject.addEventListener("enter", onEnterHandler);
    };

    var handleLoading = function(slideObject) {
      return onEnter(
        // We shall now listen for web object loading
        R.pipe(
          // Inform the wait list that we need to wait for
          // this web object
          R.tap(
            R.pipe(
              R.always(slideObject.name),
              addToWaitList
            )
          ),
          R.prop("addEventListener"),
          // Add event listener
          R.apply([
            // Event
            _extra.eventManager.events.LOADED,
            // Handler
            R.pipe(
              R.always(slideObject.name),
              removeFromWaitList
            )
          ])
        ),
        slideObject
      );
    };

    ////////////////////////////////////////
    ////// onNewWebObject

    var onNewWebObject = R.pipe(
      // Get data
      _extra.dataManager.getSlideObjectDataByName,
      R.unless(
        // Condition: Don't continue if this is a cross origin web object
        R.prop("isCrossOrigin"),

        R.pipe(
          // Get the name again
          R.prop("name"),
          // Find the slide Object
          _extra.slideObjects.getSlideObjectByName,
          // Handle the loading unless we failed to find the slide object
          R.unless(R.isNil, handleLoading)
        )
      )
    );

    ////////////////////////////////////////
    ////// register preference variable

    function register() {
      return _extra.preferenceManager.registerPreferenceModule(
        "EnsureWebObjectLoad",
        preferenceData
      );
    }

    ////////////////////////////////////////
    ////// ENTRY POINT
    R.when(
      // True/False regarding whether the preference variable exists
      R.identity,

      // Listen for web objects
      // This will cause onNewWebObject to be called with
      // web object names
      listen
    )(register());
  }
);
