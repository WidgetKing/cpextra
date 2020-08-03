_extra.registerModule(
  "xprefEnsureCpMateLoad",
  [
    "movie",
    "slideObjectManager_global",
    "utils",
    "preferenceManager",
    "loadingScreenManager",
    "whiteSpaceManager"
  ],
  function() {
    "use strict";
    ////////////////////////////////////////
    ////// variables
    var callback = _extra.slideObjects.enteredSlideChildObjectsCallbacks;
    // We can dream of Ramda...
    var R = _extra.utils;
    var enabled = false;
    var waitList = [];
    var pauseReasons = _extra.movie.reasonsForPause;

    // Default is NOTHING is CpMate
    var matchesNameList = R.equals(false);

    ////////////////////////////////////////
    ////// assist functions
    var unlessLastPauseReason = R.unless(
      R.pipe(function() {
        // We place this inside a function rather than R.always
        // because R.always() will not update to the latest
        // reasonForPause
        return _extra.movie.lastReasonForPause;
      }, R.equals(
        _extra.movie.reasonsForPause.REASON_THAT_PREVENTS_CPMATE_LOAD_PAUSING
      ))
    );

    function listen() {
      callback.addCallback(
        _extra.dataTypes.slideObjects.WEB_OBJECT,
        onNewWebObject
      );
    }

    var pause = unlessLastPauseReason(function() {
      _extra.movie.pause(pauseReasons.XPREFENSURECPMATELOAD);
    });

    var play = unlessLastPauseReason(function() {
      _extra.movie.play();
    });

    ////////////////////////////////////////
    ////// Handle Loading Start/End

    var handleLoadStart = R.pipe(_extra.loadingScreenManager.on, pause);

    var handleLoadEnd = R.pipe(_extra.loadingScreenManager.off, play);

    /**
     * Takes a string which is...
     * EITHER a @syntax query
     * OR a slide object name
     *
     * @param Query/Slide Object Name
     * @returns A function which checks if a string matches the query/slide object
     */
    var buildNameListPredicateFor = R.ifElse(
      // If it has the query icon
      R.includes("@"),
      // Then build the predicate for the Query
      R.matchesQuery("@"),
      // Otherwise a straight equals will do
      R.equals
    );

    ////////////////////////////////////////
    ////// Preference object

    var preferenceData = {
      enable: function() {
        enabled = true;
      },

      disable: function() {
        enabled = false;
      },

      /**
       * It is through the update function that the list of CpMate WebObjects
       * are provided.
       *
       * We use that information to generate a 'matchesNameList' method.
       *
       * @param cpMateWebObjects A comma delimited list of names and queries of Web Objects that match CpMate.
       */
      update: function(cpMateWebObjects) {
        matchesNameList = R.pipe(
          R.removeWhiteSpace,
          R.split(","),
          R.map(buildNameListPredicateFor),
          R.anyPass
        )(cpMateWebObjects);
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
        handleLoadStart
      )(getWaitList());
    };

    var removeFromWaitList = function(slideObjectName) {
      return R.pipe(
        R.without([slideObjectName]),
        R.tap(setWaitList),
        // GOT HERE:
        // When we uncomment the below we get a maximum call stack exceeded error
        //
        R.when(
          // Condition: List empty
          R.pipe(R.length, R.equals(0)),
          // // Play the movie
          handleLoadEnd
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

    // var handleLoading = function(slideObject) {
    //   return onEnter(
    //     // We shall now listen for web object loading
    //     R.pipe(
    //       // Inform the wait list that we need to wait for
    //       // this web object
    //       R.tap(
    //         R.pipe(
    //           R.always(slideObject.name),
    //           addToWaitList
    //         )
    //       ),
    //       R.prop("addEventListener"),
    //       // Add event listener
    //       R.apply([
    //         // Event
    //         _extra.eventManager.events.LOADED,
    //         // Handler
    //         R.pipe(
    //           R.always(slideObject.name),
    //           removeFromWaitList
    //         )
    //       ])
    //     ),
    //     slideObject
    //   );
    // };
    var listenForAnimationLoad = function(slideObjectName) {
      return function(listener) {
        return _extra.cpMate.listenForNotification(slideObjectName, listener);
      };
    };

    var handleLoading = function(slideObject) {
      return onEnter(
        // We shall now listen for web object loading
        R.pipe(
          R.always(slideObject.name),
          // Inform the wait list that we need to wait for
          // this web object
          R.tap(addToWaitList),
          listenForAnimationLoad,
          R.apply([
            R.when(
              // Don't react to the wrong notification
              R.equals("animationready"),
              R.pipe(R.always(slideObject.name), removeFromWaitList)
            )
          ])
        ),

        // The second parameter for onEnter()
        slideObject
      );
    };

    ////////////////////////////////////////
    ////// isWebObjectValid()
    // But first... Some helper functions

    var isNotCrossOrigin = R.complement(
      R.pipe(
        // Get data
        _extra.dataManager.getSlideObjectDataByName,
        R.prop("isCrossOrigin")
      )
    );

    var isWebObjectValid = R.allPass([
      isNotCrossOrigin,
      function(name) {
        // So we wrap this in a method because the matchesNameList
        // method may change as the update() method generates new
        // versions of the method
        return matchesNameList(name);
      }
    ]);

    ////////////////////////////////////////
    ////// onNewWebObject()

    /**
     * Called when a new Web Object is added to the stage.
     *
     * This function will then decide whether this object should be passed
     * on to the 'handleLoading' function.
     *
     * @param The name of the new Web Object
     */
    var onNewWebObject = R.when(
      // Condition: Don't continue if this is a cross origin web object
      // OR: The name does not mach the list of objects that are CpMate
      isWebObjectValid,

      R.pipe(
        // Find the slide Object
        _extra.slideObjects.getSlideObjectByName,

        // Handle the loading unless we failed to find the slide object
        R.unless(R.isNil, handleLoading)
      )
    );

    ////////////////////////////////////////
    ////// ENTRY POINT
    ////////////////////
    // Register preference variable

    function register() {
      return _extra.preferenceManager.registerPreferenceModule(
        "EnsureCpMateLoad",
        preferenceData
      );
    }

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
