_extra.registerModule(
  "loadingScreenManager",
  ["softwareInterfacesManager"],
  function() {
    "use strict";

    var Z_INDEX = 1e4;
    var active = false;

    var loadingScreen = _extra.captivate.api("blockUserInteraction");

    _extra.loadingScreenManager = {
      on: function() {
        loadingScreen.style.display = "block";
        loadingScreen.style.zIndex = Z_INDEX;
        active = true;
      },
      off: function() {
        loadingScreen.style.display = "none";
        loadingScreen.style.zIndex = -Z_INDEX;
        active = false;
      }
    };

    Object.defineProperty(_extra.loadingScreenManager, "Z_INDEX", {
      get: function() {
        return Z_INDEX;
      }
    });

    Object.defineProperty(_extra.loadingScreenManager, "active", {
      get: function() {
        return active;
      }
    });
  }
);
