describe("xprefWakeLock", function() {
  ////////////////////////////////////////
  ////// REQUIRES

  var module = unitTests.getModule("xprefWakeLock");
  var utils = unitTests.getModule("utils");

  ////////////////////////////////////////
  ////// VARIABLES
  var preferenceData;
  var onMouseDown;

  ////////////////////////////////////////
  ////// BEFORE EACH

  beforeEach(function() {
    window._extra = {
      w: {
        addEventListener: jasmine
          .createSpy("window.addEventListener")
          .and.callFake(function(event, listener) {
            onMouseDown = listener;
          }),
        removeEventListener: jasmine.createSpy("window.removeEventListener"),
        clearInterval: clearInterval,
        MSSStream: true,
        location: {
          href: "www.infosemantics.com.au"
        },
        setTimeout: setTimeout
      },
      classes: unitTests.classes,
      preferenceManager: {
        registerPreferenceModule: jasmine
          .createSpy("registerPreferenceModule")
          .and.callFake(function(name, pd) {
            preferenceData = pd;
          })
      }
    };

    utils();
    module();
  });

  ////////////////////////////////////////
  ////// AFTER EACH

  afterEach(function() {
    delete window._extra;
  });

  ////////////////////////////////////////
  ////////// TESTS
  ////////////////////////////////////////

  it("should register a module with preferenceManager", function() {
    expect(
      _extra.preferenceManager.registerPreferenceModule
    ).toHaveBeenCalled();
  });

  ////////////////////////////////////////
  ////// ENABLE()

  describe("enable()", function() {
    var noSleepMock;

    beforeEach(function() {
      noSleepMock = function() {
        // constructor;
      };

      noSleepMock.prototype.enable = jasmine.createSpy("noSleepMock.enable()");
      noSleepMock.prototype.disable = jasmine.createSpy(
        "noSleepMock.disable()"
      );

      _extra.w.NoSleep = noSleepMock;
    });

    it("should first listen for a mouse event", function() {
      // 1: SETUP
      // 2: TEST
      preferenceData.enable();
      // 3: ASSERT
      expect(_extra.w.addEventListener).toHaveBeenCalled();
    });

	  // It's kind of hard to test this module because I don't know
	  // how to detect when NoSleep has been turned on
  });
});
