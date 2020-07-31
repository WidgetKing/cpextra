_extra.registerModule(
  "xprefDisableGestures",
  ["preferenceManager", "slideManager_global", "softwareInterfacesManager"],
  function() {
    "use strict";

    var enabled = true;

    var info = {
      enable: function() {
        enabled = false;
        update();
      },

      disable: function() {
        enabled = true;
        update();
      }
    };

    function update() {
      _extra.captivate.gestureManager.enabled = enabled;
    }

    // Register
    var exists = _extra.preferenceManager.registerPreferenceModule(
      "DisableGestures",
      info
    );

    if (exists) {
      _extra.slideManager.enterSlideCallback.addCallback("*", update);
    }
  },
  _extra.CAPTIVATE
);
