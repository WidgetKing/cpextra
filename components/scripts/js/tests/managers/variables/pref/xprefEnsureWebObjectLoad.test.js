describe("xprefEnsureWebObjectLoad", function() {
  ////////////////////////////////////////
  ////// variables

  var module = unitTests.getModule("xprefEnsureWebObjectLoad");
  var utils = unitTests.getModule("utils");
  var preferenceObject;
  var slideObjects;
  var slideObjectDatas;

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
      callHandler: function(event) {
        listener[event]();
      }
    };
  }
  ////////////////////////////////////////
  ////// before each

  beforeEach(function() {
    slideObjectDatas = {};
    slideObjects = {};

    addSlideObjectProxy("foobar");
    addSlideObjectDataProxy("foobar");

    window._extra = {
      classes: unitTests.classes,

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
    ).toHaveBeenCalledWith("EnsureWebObjectLoad", jasmine.any(Object));

    expect(preferenceObject).toBeDefined();
  });

  describe("preferenceObject.enable", function() {
    it("should listen for web objects", function() {});
  });

  describe("preferenceObject.disable", function() {
    it("should stop listening for web objects", function() {});
  });

  ////////////////////////////////////////
  ////// onNewWebObject
  describe("onNewWebObject()", function() {
    it("should pause the movie when the web object has not yet loaded", function() {
      // 1: SETUP
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
      onNewWebObject("foobar");

      // 2: TEST
      slideObjects.foobar.callHandler("enter");
      slideObjects.foobar.callHandler("loaded");

      // 3: ASSERT
      expect(_extra.movie.play).toHaveBeenCalled();
    });
  });
});
