_extra.registerModule(
  "xprefDocumentBackgroundColor",
  ["preferenceManager"],
  function() {
    _extra.preferenceManager.registerPreferenceModule(
      "DocumentBackgroundColor",
      {
        enable: function() {
          // Required by registerPreferenceModule
        },

        disable: function() {
          // Required by registerPreferenceModule
        },

        update: function(value) {
          if (typeof value !== "string" || value === "") return;
          if (value[0] !== "#") value = "#" + value;
          _extra.$(".cpMainContainer").css("background-color", value);
        }
      }
    );
  }
);
