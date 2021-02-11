// xprefOrientationChangeTransition.test.js

describe("A test suite for xprefOrientationChangeTransition", function() {
  "use strict";

  var module = unitTests.getModule("xprefOrientationChangeTransition");
  var utils = unitTests.getModule("utils");

  ////////////////////////////////////////
  ////// SETUP

  var moduleDetails;
  var originalAdjustWindow;
  var variableExists = true;

  var fadeInCompleteCallback;

  beforeEach(function() {
    originalAdjustWindow = jasmine.createSpy("__adjustWindow");
    window._extra = {
      variableManager: {
        prepareParameters: function(string) {
          return string.split(",");
        }
      },

      preferenceManager: {
        registerPreferenceModule: function(variableName, passedDetails) {
          moduleDetails = passedDetails;
          return variableExists;
        }
      },
      classes: unitTests.classes,
      w: window
    };

    window.cp = {
      __adjustWindow: originalAdjustWindow
    };

    window.$ = function() {
      function return$$() {
        return $$;
      }
      var $$ = {
        addClass: return$$,
        appendTo: return$$,
        css: return$$,
        fadeIn: function(time, callback) {
          fadeInCompleteCallback = callback;
          return return$$();
        },
        fadeOut: return$$
      };

      return $$;
    };
    window.$.extend = Object.assign;
  });

  afterEach(function() {
    delete window._extra;
    delete window.$;
    delete window.cp;

    moduleDetails = null;
  });

  ////////////////////////////////////////
  ////// TESTS

  it("should register a module", function() {
    // 1: SETUP
    // 2: TEST
    utils();
    module();

    // 3: ASSERT
    expect(moduleDetails).not.toBeUndefined();
  });

  it("should run __adjust window if not a orientationchanged event", function() {
    // 1: SETUP
    utils();
    module();

    // 2: TEST

    var event = { type: "resize" };
    cp.__adjustWindow(event);
    // 3: ASSERT
    expect(originalAdjustWindow).toHaveBeenCalledWith(event);
  });

  it("should run __adjust window if not a orientationchanged event", function() {
    // 1: SETUP
    utils();
    module();

    // 2: TEST
    var orientationChangeEvent = { type: "orientationchange" };
    cp.__adjustWindow(orientationChangeEvent);
    // 3: ASSERT
    expect(originalAdjustWindow).not.toHaveBeenCalled();
    expect(fadeInCompleteCallback).toBeDefined();

    // 4: TEST

    var resizeEvent = { type: "resize" };
    cp.__adjustWindow(resizeEvent);

    expect(originalAdjustWindow).not.toHaveBeenCalled();
    // 5: CONTINUE TO TEST

    fadeInCompleteCallback();

    expect(originalAdjustWindow).toHaveBeenCalledWith(orientationChangeEvent);
    expect(originalAdjustWindow).toHaveBeenCalledWith(resizeEvent);
  });
});
