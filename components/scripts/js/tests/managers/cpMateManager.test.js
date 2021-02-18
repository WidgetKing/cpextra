/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 2:13 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.cpMate", function() {
  "use strict";

  var module = unitTests.getModule("cpMateManager");

  beforeEach(function() {
    window._extra = {
      classes: unitTests.classes,
      captivate: {
        eventDispatcher: new unitTests.classes.EventDispatcher(),
        events: {
          MOVIE_RESUME: "movie_resume",
          MOVIE_PAUSE: "movie_pause"
        }
      }
    };

    module();
  });

  afterEach(function() {
    delete window._extra;
  });

  it("should define _extra.cpMate", function() {
    expect(_extra.cpMate).toBeDefined();
  });

  it("should use cpMate.register to send us signals", function() {
    var spy = jasmine.createSpy("spy"),
      listener = function(data) {
        expect(data).toEqual({
          action: "hello",
          parameters: []
        });
      };

    _extra.cpMate.register("Web_1", listener);
    _extra.cpMate.register("Web_2", spy);

    _extra.cpMate.broadcastTo("Web_1", {
      action: "hello",
      parameters: []
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it("should use cpMate.deregister to stop sending us signals", function() {
    var spy = jasmine.createSpy("spy");

    _extra.cpMate.register("Web_1", spy);
    _extra.cpMate.deregister("Web_1", spy);
    _extra.cpMate.broadcastTo("Web_1", {});

    expect(spy).not.toHaveBeenCalled();
  });

  describe("_extra.cpMate.hasRegistered()", function() {
    it("should return true if cpMate has already registered under that name", function() {
      // 1: SETUP
      var name = "foobar";
      var spy = jasmine.createSpy("spy");
      _extra.cpMate.register(name, spy);

      // 2: TEST
      var result = _extra.cpMate.hasRegistered(name);

      // 3: ASSERT
      expect(result).toEqual(true);
    });

    it("should return false otherwise", function() {
      // 1: SETUP

      // 2: TEST
      var result = _extra.cpMate.hasRegistered("anything");

      // 3: ASSERT
      expect(result).toEqual(false);
    });
  });

  describe("_extra.cpMate.notifyCpExtra()", function() {
    it("should send notifications to CpExtra", function() {
      // 1: SETUP
      var name = "foobar";
      var notification = "party";
      var spy = jasmine.createSpy("spy");

      // 2: TEST
      _extra.cpMate.listenForNotification(name, spy);
      _extra.cpMate.notifyCpExtra(name, notification);

      // 3: ASSERT
      expect(spy).toHaveBeenCalledWith(notification);
    });
  });
});
