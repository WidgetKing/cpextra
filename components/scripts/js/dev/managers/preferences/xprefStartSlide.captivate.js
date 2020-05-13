// We have xprefInitAction as a requirement so that
// we make sure its action is run before xprefStartSlide is run
_extra.registerModule(
  'xprefStartSlide',
  ['preferenceManager', 'xprefInitAction'],
  function() {
    ////////////////////////////////////////
    ////// Entry Point

    _extra.preferenceManager.registerPreferenceModule('StartSlide', {
      enable: function() {
        // required by preference manager
      },

      disable: function() {
        // required by preference manager
      },

      update: function(query) {
        _extra.preferenceManager.callAfterXprefInitAction(function() {

          try {
          var slideName;

          if (_extra.isQuery(query)) {
            
            var result = _extra.slideManager.querySlides(query);

            if (result) {
              slideName = result[0];
            }

          } else {
            slideName = query;
          }

    } catch (e) {
      console.log("Error in xprefInitAction");
    }
            if (slideName) _extra.slideManager.gotoSlideAndPlay(slideName);

        });
      }
    });
  }
);
