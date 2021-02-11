_extra.registerModule(
  "xprefOrientationChangeTransition",
  [
    "utils",
    "softwareInterfacesManager",
    "commandVariableManager",
    "preferenceManager"
  ],
  function() {
    var VARIABLE_NAME = "OrientationChangeTransition";
    var R = _extra.utils;
    var setDefaults = R.mergeRight({ time: 500, color: "#FFFFFF" });
    var settings = setDefaults({});

    var isEnabled = _extra.preferenceManager.registerPreferenceModule(
      VARIABLE_NAME,
      {
        enable: function() {
          // Required by registerPreferenceModule
        },

        disable: function() {
          // Required by registerPreferenceModule
        },

        update: function(value) {
          var params = _extra.variableManager.prepareParameters(value);
          var newSettings = {};
          if (params[0])
            newSettings.time = _extra.w.parseFloat(params[0]) * 1000;
          if (params[1]) newSettings.color = params[1];
          settings = setDefaults(newSettings);
        }
      }
    );

    ////////////////////////////////////////
    ////// BEHAVIOUR

    function addStylesAndDivs() {
      // Create overlay style
      $(
        "<style type='text/css'> .overlay{ position:fixed; z-index:999999; top: 0; left: 0; width: 100%; height:100%; background: #fff; display:none; }</style>"
      ).appendTo("head");

      // Create overlay div
      return $("<div/>")
        .addClass("overlay")
        .appendTo("body");
    }

    function createAdjustWindowListener(details) {
      var waitingArgs = [];

      function isCurrentlyWaiting() {
        return waitingArgs.length !== 0;
      }

      function listener() {
        var args = arguments;

        if (!isCurrentlyWaiting() && details.predicate.apply(null, args)) {
          details.original.apply(null, args);
        } else {
          // We have not started waiting yet.
          if (!isCurrentlyWaiting()) details.startTimer();
          waitingArgs.push(args);
        }
      }

      listener.applyToOriginal = function(args) {
        details.original.apply(null, args);
      };

      listener.callAllWaitingArgs = function() {
        waitingArgs.forEach(listener.applyToOriginal);
        waitingArgs = [];
      };
      return listener;
    }

    function replace__adjustWindow($overlay) {

      var listener = createAdjustWindowListener({
        original: cp.__adjustWindow,
        predicate: function(event) {
          return !event || event.type !== "orientationchange"; 
        },
        startTimer: function() {
          $overlay
            .css("background-color", settings.color)
            .css("display", "inline")

			setTimeout(function () {

              $overlay.fadeOut(settings.time);

              try {
                listener.callAllWaitingArgs();
              } catch (e) {
                // Maximum call stack exceeded
                // Common problem with breakpoint Captivate
              }
				

			}, 100)
            // .fadeIn(settings.time, function() {
            //   $overlay.fadeOut(settings.time);

            //   try {
            //     listener.callAllWaitingArgs();
            //   } catch (e) {
            //     // Maximum call stack exceeded
            //     // Common problem with breakpoint Captivate
            //   }
            // });
        }
      });

      cp.__adjustWindow = listener;
    }

    function init() {
      var $overlay = addStylesAndDivs();
      replace__adjustWindow($overlay);
    }

    if (isEnabled) init();

    // var FADE_TIME = 1000;
    // var DELAY = 200;

    // function fadeIn() {
    //   $overlay.fadeIn(FADE_TIME);
    // }

    // function fadeOut() {
    //   $overlay.fadeOut(FADE_TIME);
    // }

    // var original__adjustWindow = cp.__adjustWindow;

    // cp.__adjustWindow = function(event) {
    //   // If orientation change then pause everything.
    //   if (event && event.type === "orientationchange") {
    //     var originalArugments = arguments;

    //     // Fade timeout
    //     fadeIn();
    //     setTimeout(function() {
    //       original__adjustWindow.apply(null, originalArugments);

    //       setTimeout(function() {
    //         // Fade In timer
    //         fadeOut();
    //       }, DELAY);
    //     }, FADE_TIME);

    //     // Not an orientation change, so pass everything along.
    //   } else {
    //     // Run method as normal
    //     original__adjustWindow.apply(null, arguments);
    //   }
    // };
  }
);
