_extra.registerModule(
  "jsLoadManager",
  ["utils", "generalDataManager"],
  function() {
    var u = _extra.utils;
    var unlessNil = u.unless(u.isNil);
    var filterNils = u.filter(u.complement(u.isNil));

    var getJsFileFromString = u.getFilePath(".js");

    _extra.jsLoadManager = {};

    /**
     * Takes a validated path to a Javascript file
     * and then loads it into the document
     *
     * @param jsFilePath string path of javascript file
     *
     */
    _extra.jsLoadManager.load = unlessNil(function(src) {
      // The following code is based off of asmmahmud's answer to this StackOverflow question:
      // https://stackoverflow.com/questions/40808425/how-to-dynamically-load-and-use-call-a-javascript-file
      var pendingScripts = [];
      var firstScript = document.scripts[0];
      var script;
      // Watch scripts load in IE
      function stateChange() {
        // Execute as many scripts in order as we can
        var pendingScript;
        while (pendingScripts[0] && pendingScripts[0].readyState == "loaded") {
          pendingScript = pendingScripts.shift();
          // avoid future loading events from this script (eg, if src changes)
          pendingScript.onreadystatechange = null;
          // can't just appendChild, old IE bug if element isn't closed
          firstScript.parentNode.insertBefore(pendingScript, firstScript);
        }
      }
      // loop through our script urls
      if ("async" in firstScript) {
        // modern browsers
        script = document.createElement("script");
        script.async = false;
        script.src = src;
        document.head.appendChild(script);
      } else if (firstScript.readyState) {
        // IE<10
        // create a script and add it to our todo pile
        script = document.createElement("script");
        pendingScripts.push(script);
        // listen for state changes
        script.onreadystatechange = stateChange;
        // must set src AFTER adding onreadystatechange listener
        // else we?ll miss the loaded event for cached scripts
        script.src = src;
      } else {
        // fall back to defer
        document.write('<script src="' + src + '" defer></' + "script>");
      }
    });

    /**
     * Takes slide object data, extracts relevant javascript files
     *
     * @return array of Javascript files
     */

    _extra.jsLoadManager.getJsFilesFromData = u.pipe(function(data) {
      // If this is not interactive then return empty array.
      if (!data.isInteractiveObject) {
        _extra.error("CV007", data.name);
        return [];
      }

      // Is interactive, we can process success and failure actions.
      return [
        getJsFileFromString(data.successAction),
        getJsFileFromString(data.failureAction),
        getJsFileFromString(data.focusLostAction)
      ];
    }, filterNils);

    /**
     * Takes a slide object name and extracts the path to javascript files
     * from that object's success/failure actions
     *
     * @param InteractiveObjectName name of interactive object who's success/failure actions include a path to a javascript file.
     */

    _extra.jsLoadManager.loadFromAction = function(name) {
      var callCV080 = function() {
        _extra.error("CV080", name);
      };

      u.pipe(
        _extra.dataManager.getSlideObjectDataByName,
        _extra.jsLoadManager.getJsFilesFromData,
        // Now have an array of all javascript files, we can load them.
        u.ifElse(
          // If
          u.isEmpty,
          // Then
          callCV080,
          // Else
          u.forEach(u.__, _extra.jsLoadManager.load)
        )
      )(name);
    };
  }
);
