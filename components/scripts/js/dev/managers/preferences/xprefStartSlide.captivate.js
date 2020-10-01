// We have xprefInitAction as a requirement so that
// we make sure its action is run before xprefStartSlide is run
_extra.registerModule(
  "xprefStartSlide",
  ["preferenceManager", "xprefInitAction"],
  function() {
    ////////////////////////////////////////
    ////// Entry Point

    _extra.preferenceManager.registerPreferenceModule("StartSlide", {
      enable: function() {
        // required by preference manager
      },

      disable: function() {
        // required by preference manager
      },

      update: function(query) {
        _extra.preferenceManager.callAfterXprefInitAction(function() {
          // Now ready to jump to another slide
          var slideName;

          // Is this something like: @_slide
          if (_extra.isQuery(query)) {
            // Get array of slides matching this query
            var result = _extra.slideManager.querySlides(query);

            // Choose the first matching slide
            if (result) {
              slideName = result[0];
            }
          } else {
            slideName = query;

            // If this is a number
            var number = _extra.w.parseInt(slideName);

            // Reduce number by 1 to fit with zero based slide numbers
            if (!_extra.w.isNaN(number)) slideName = number - 1;
          }

          if (slideName) _extra.slideManager.gotoSlideAndPlay(slideName);
        });
      }
    });
  }
);
