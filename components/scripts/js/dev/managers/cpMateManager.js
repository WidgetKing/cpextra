/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 2:12 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule(
  "cpMateManager",
  ["softwareInterfacesManager"],
  function() {
    "use strict";

    var callback = new _extra.classes.Callback();
    var notifications = new _extra.classes.Callback();

    _extra.cpMate = {
      // In theory, we should be able to cut down on the lines of code
      // by useing the six lines below.
      // But for some reason they cause errors.
      // Don't have time to work it out just at the moment.
      // register: callback.addCallback,
      // deregister: callback.removeCallback,
      // broadcastTo: callback.sendToCallback,
      // hasRegistered: callback.hasCallbackFor,
      // notifyCpExtra: notifications.sendToCallback,
      // listenForNotification: notifications.addCallback

      register: function(slideObjectName, listener) {
        callback.addCallback(slideObjectName, listener);
      },
      deregister: function(slideObjectName, listener) {
        callback.removeCallback(slideObjectName, listener);
      },
      broadcastTo: function(slideObjectName, parameters) {
        callback.sendToCallback(slideObjectName, parameters);
      },
      hasRegistered: function(slideObjectName) {
        return callback.hasCallbackFor(slideObjectName);
      },
      notifyCpExtra: function(slideObjectName, notification) {
        notifications.sendToCallback(slideObjectName, notification);
      },
      listenForNotification: function(slideObjectName, callback) {
        notifications.addCallback(slideObjectName, callback);
      }
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// Pause / Resume handling
    ///////////////////////////////////////////////////////////////////////
    _extra.captivate.eventDispatcher.addEventListener(
      _extra.captivate.events.MOVIE_PAUSE,
      function() {
        _extra.cpMate.broadcastTo("*", {
          action: "moviePause",
          parameters: []
        });
      }
    );

    _extra.captivate.eventDispatcher.addEventListener(
      _extra.captivate.events.MOVIE_RESUME,
      function() {
        _extra.cpMate.broadcastTo("*", {
          action: "movieResume",
          parameters: []
        });
      }
    );
  }
);
