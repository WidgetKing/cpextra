describe("xprefEnsureCpMateLoad", function() {
  ////////////////////////////////////////
  ////// variables

  var module = unitTests.getModule("xprefEnsureCpMateLoad");
  var utils = unitTests.getModule("utils");
  var preferenceObject;
  var slideObjects;
  var slideObjectDatas;
	var listenForNotification_input;

  ////////////////////////////////////////
  ////// assist methods
  function onNewWebObject(name) {
    var dataType = _extra.dataTypes.slideObjects.WEB_OBJECT;

    _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback(
      dataType,
      name
    );
  }

  function addSlideObjectDataProxy(name) {
    slideObjectDatas[name] = {
      name: name,
      url: "foo/bar/index.html",
      isCrossOrigin: false
    };
  }

  function addSlideObjectProxy(name) {
    var listener = {};

    slideObjects[name] = {
      isLoaded: false,
      addEventListener: function(event, handler) {
        listener[event] = handler;
      },
      removeEventListener: jasmine.createSpy(
        "slideObject.removeEventListener()"
      ),
		name:name,
      callHandler: function(event) {
        if (listener.hasOwnProperty(event)) {
          listener[event]();
        } else {
          console.log("could not find mock event: " + event);
        }
      }
    };
  }
  ////////////////////////////////////////
  ////// before each

  beforeEach(function() {
    slideObjectDatas = {};
    slideObjects = {};
	  listenForNotification_input = {};

    addSlideObjectProxy("foobar");
    addSlideObjectDataProxy("foobar");
    addSlideObjectProxy("foo");
    addSlideObjectDataProxy("foo");
    addSlideObjectProxy("bar");
    addSlideObjectDataProxy("bar");

    window._extra = {
      classes: unitTests.classes,

		cpMate: {
			listenForNotification: function (slideObjectName, listener) {

				listenForNotification_input[slideObjectName] = listener;

			}
		},

      movie: {
        pause: jasmine.createSpy("movie.pause()"),
        play: jasmine.createSpy("movie.play()")
      },

      eventManager: {
        events: {
          LOADED: "loaded"
        }
      },

      preferenceManager: {
        registerPreferenceModule: jasmine
          .createSpy("registerPreferenceModule")
          .and.callFake(function(name, object) {
            preferenceObject = object;
            return true;
          })
      },

      dataManager: {
        getSlideObjectDataByName: function(name) {
          return slideObjectDatas[name];
        }
      },

      slideObjects: {
        enteredSlideChildObjectsCallbacks: new unitTests.classes.Callback(),
        getSlideObjectByName: function(name) {
          return slideObjects[name];
        }
      },

      dataTypes: {
        slideObjects: {
          WEB_OBJECT: 0
        }
      }
    };

    utils();
    module();
  });

  ////////////////////////////////////////
  ////// start tests

  it("should register the xprefEnsureWebObjectLoad variable", function() {
    expect(
      _extra.preferenceManager.registerPreferenceModule
    ).toHaveBeenCalledWith("EnsureCpMateLoad", jasmine.any(Object));

    expect(preferenceObject).toBeDefined();
  });

  describe("preferenceObject.enable()", function() {
    it("should listen for web objects", function() {});
  });

  describe("preferenceObject.disable()", function() {
    it("should stop listening for web objects", function() {});
  });

  describe("preferenceObject.update()", function() {
    it("should pause with objects that match list", function() {
      // 1: SETUP
      var list = "foobar";

      // 2: TEST
      preferenceObject.update(list);
      onNewWebObject("foobar");
      slideObjects.foobar.callHandler("enter");

      // 3: ASSERT
      expect(_extra.movie.pause).toHaveBeenCalled();
    });

    it("should NOT pause with objects that don't match the list", function() {
      // 1: SETUP
      var list = "not_foobar";

      // 2: TEST
      preferenceObject.update(list);
      onNewWebObject("foobar");
      slideObjects.foobar.callHandler("enter");

      // 3: ASSERT
      expect(_extra.movie.pause).not.toHaveBeenCalled();
    });

    it("should allow multiple items in the list", function() {
      // 1: SETUP
      var list = "foo, bar";

      // 2: TEST
      preferenceObject.update(list);
      onNewWebObject("bar");
      slideObjects.bar.callHandler("enter");

      // 3: ASSERT
      expect(_extra.movie.pause).toHaveBeenCalled();
    });

    it("should pause with objects that match query", function() {
      // 1: SETUP
      var list = "foo@";

      // 2: TEST
      preferenceObject.update(list);
      onNewWebObject("foobar");
      slideObjects.foobar.callHandler("enter");

      // 3: ASSERT
      expect(_extra.movie.pause).toHaveBeenCalled();
    });

  });

  ////////////////////////////////////////
  ////// onNewWebObject
  describe("onNewWebObject()", function() {
    it("should pause the movie when the web object has not yet loaded", function() {
      // 1: SETUP
      preferenceObject.update("foobar");
      onNewWebObject("foobar");
      // 2: TEST
      slideObjects.foobar.callHandler("enter");
      // 3: ASSERT
      expect(_extra.movie.pause).toHaveBeenCalled();
      expect(slideObjects.foobar.removeEventListener).toHaveBeenCalledWith(
        "enter",
        jasmine.any(Function)
      );
    });

    it("should resume playing the movie when the web object loads", function() {
      // 1: SETUP
      preferenceObject.update("foobar");
      onNewWebObject("foobar");

      // 2: TEST
      slideObjects.foobar.callHandler("enter");
		listenForNotification_input["foobar"]("animationready")

      // 3: ASSERT
      expect(_extra.movie.play).toHaveBeenCalled();
    });
  });
});
