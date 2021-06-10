_extra.registerModule(
  "fontEmbedManager",
  ["utils", "generalDataManager"],
  function() {
    var u = _extra.utils;
    function getExtension(extension, action) {
      if (u.contains(extension)) return u.getFilePath(extension, action);
    }

    function getFontPath(path) {
      var result = getExtension(".ttf", path);
      if (!result) result = getExtension(".woff", path);
      if (!result) result = getExtension(".oft", path);
      if (!result) result = getExtension(".woff2", path);
      if (!result) result = getExtension(".ttc", path);
      if (!result) result = getExtension(".fon", path);

      return result;
    }

    //// ------------ _extra.fontEmbedManager
    _extra.fontEmbedManager = {
      /**
       * Creates and appends a style tag which loads the font url.
       *
       * This is the end point of xcmndEmbedFontFromFile.
       *
       * @param {string} Font family name that will be associated with the file
       * @param {string} Url to file
       */
      embed: function(fontName, url) {
        var style =
          "<style>@font-face { font-family: '" +
          fontName +
          "'; src: url('" +
          url +
          "')}</style>";

        // Add to head
        _extra.$(style).appendTo("head");
      },

      /**
       * Takes the parameters from xcmndEmbedFontFile and formats
       * them to pass to _extra.fontEmbedManager.embed()
       * This is done by analysing an Interactive Object's criteria action to determine whether it has an Open URL or File action pointing to a tff file.
       *
       * @param {string} Name of Interactive Object which holds a Load URL or File action.
       * @param {string} Font family name that will be associated with the file.
       * @param {string} Interactive Object Criterai that holds a Load URL or File action.
       */
      embedFromAction: function(fontName, interactiveObject, criteria) {
        function sendError(data) {
          _extra.error("CV007", data.name);
        }
        u.pipe(
          _extra.dataManager.getSlideObjectDataByName,
          u.ifElse(
            u.propEq("isInteractiveObject", true),
            u.pipe(
              u.getCriteriaAction(criteria),
              getFontPath,
              u.unless(u.isNil, function(path) {
                _extra.fontEmbedManager.embed(fontName, path);
              })
            ),
            sendError
          )
        )(interactiveObject);
      }
    };
  }
);
