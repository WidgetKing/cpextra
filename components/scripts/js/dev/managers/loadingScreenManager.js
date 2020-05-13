_extra.registerModule(
  "loadingScreenManager",
  ["slideManager_global", "softwareInterfacesManager"],
  function() {
    "use strict";

    var Z_INDEX = 1e4;
    var active = false;

    // Get reference to the DIV that contains the loading screen.
    var loadingScreen = _extra.captivate.api("blockUserInteraction");

    _extra.loadingScreenManager = {
      // Turns loading screen on
      on: function() {
        loadingScreen.style.display = "block";
        loadingScreen.style.zIndex = Z_INDEX;
        active = true;
      },

      // Turns loading screen off
      off: function() {
        loadingScreen.style.display = "none";
        loadingScreen.style.zIndex = -Z_INDEX;
        active = false;
      }
    };

    // Give access to the TOP Z_INDEX of the loading screen
    // That way we can place other divs above this
    // I believe this is referenced in YAK.
    Object.defineProperty(_extra.loadingScreenManager, "Z_INDEX", {
      get: function() {
        return Z_INDEX;
      }
    });

    // Returns whether loading screen is currently visible.
    Object.defineProperty(_extra.loadingScreenManager, "active", {
      get: function() {
        return active;
      }
    });

    ////////////////////////////////////////
    ////// REMOVE LOADING SCREEN WHEN GOING TO ANOTHER SLIDE
    _extra.slideManager.enterSlideCallback.addCallback(
      "*",
      _extra.loadingScreenManager.off
    );
  }
);
