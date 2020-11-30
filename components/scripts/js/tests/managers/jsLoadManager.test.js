describe("A test suite for _extra.jsLoadManager", function() {
  "use strict";

  var module = unitTests.getModule("jsLoadManager"),
    utils = unitTests.getModule("utils"),
    datas;

  function createData(name, successAction, failureAction, isInteractive) {
    if (isInteractive === undefined) isInteractive = true;
    datas[name] = {
      isInteractiveObject: isInteractive,
      successAction: successAction,
      failureAction: failureAction,
      name: name
    };
    return datas[name];
  }

  beforeEach(function() {
    datas = {};

    window._extra = {
      error: jasmine.createSpy(),
      dataManager: {
        getSlideObjectDataByName: function(dataName) {
          return datas[dataName];
        }
      }
    };

    utils();
    module();
  });

  afterEach(function() {
    delete window._extra;
  });

  describe("_extra.jsLoadManager.getJsFilesFromData()", function() {
    it("should read slide object data and return array of javascript file paths", function() {
      // 1: SETUP
      var successAction =
        "cp.openURL('success.js','_self');cp.actionChoiceContinueMovie();";
      var failureAction =
        "cp.openURL('fail.js','_self');cp.actionChoiceContinueMovie();";

      var data = createData("foo", successAction, failureAction);

      // 2: TEST
      var result = _extra.jsLoadManager.getJsFilesFromData(data);

      // 3: ASSERT
      expect(result[0]).toBe("success.js");
      expect(result[1]).toBe("fail.js");
    });

    it("should return empty array if we pass a non-interactive object and throw CV007", function() {
      // 1: SETUP
      var isInteractive = false;
      var data = createData("foo", "", "", isInteractive);
      // 2: TEST
      var result = _extra.jsLoadManager.getJsFilesFromData(data);
      // 3: ASSERT
      expect(result.length).toBe(0);
      expect(_extra.error).toHaveBeenCalledWith("CV007", "foo");
    });

    it("should drop any invalid actions from array", function() {
      // 1: SETUP
      var successAction = "cpCmndResume = 1;";
      var failureAction =
        "cp.openURL('fail.js','_self');cp.actionChoiceContinueMovie();";

      var data = createData("foo", successAction, failureAction);
      // 2: TEST
      var result = _extra.jsLoadManager.getJsFilesFromData(data);

      // 3: ASSERT
      expect(result.length).toBe(1);
      expect(result[0]).toBe("fail.js");
    });

    it("should work with unexpected extra ' marks ", function() {
      // 1: SETUP
      var successAction =
        "cp.openURL('other.pdf'); cp.openURL('success.js','_self');";
      var failureAction =
        "cp.openURL('fail.js','_self');cp.openURL('fail2.js','_self');";

      var data = createData("foo", successAction, failureAction);

      // 2: TEST
      var result = _extra.jsLoadManager.getJsFilesFromData(data);

      // 3: ASSERT
      expect(result[0]).toBe("success.js");
      expect(result[1]).toBe("fail.js");
    });

    it("should run a text entry box's on focus lost action", function() {
      // 1: SETUP
      var data = createData("foo", null, null);
      data.focusLostAction =
        "cp.openURL('focus-lost.js','_self');cp.openURL('fail2.js','_self');";
      // 2: TEST
      var result = _extra.jsLoadManager.getJsFilesFromData(data);
      // 3: ASSERT
      expect(result[0]).toBe("focus-lost.js");
    });
  });

  describe("loadFromAction()", function() {
    it("should throw CV080 when no valid actions passed", function() {
      // 1: SETUP
      var data = createData("foo", "null", "null");

      // 2: TEST
      _extra.jsLoadManager.loadFromAction("foo");

      // 3: ASSERT
      expect(_extra.error).toHaveBeenCalledWith("CV080", "foo");
    });
  });
});
