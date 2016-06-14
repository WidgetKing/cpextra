/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/11/15
 * Time: 9:34 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.debugging", function () {

    "use strict";

    var module = unitTests.getModule("debuggingManager");

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "console":{
                "log":jasmine.createSpy("_extra.console.log"),
                "error":jasmine.createSpy("_extra.console.error")
            },
            "w":{
                "alert":jasmine.createSpy("_extra.w.alert")
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.debugging object", function () {
        expect(_extra.debugging).toBeDefined();
    });

    it("should send traces to the console by default", function () {

        _extra.debugging.log("Hello");
        expect(_extra.console.log).toHaveBeenCalledWith("Hello");

        _extra.debugging.error("World");
        expect(_extra.console.error).toHaveBeenCalledWith(jasmine.any(String));

    });

    it("should send alert messages if sent to debug mode", function () {

        _extra.preferences = {
            "debugMode":true
        };

        _extra.debugging.error("World");
        expect(_extra.w.alert).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String));

    });

    it("should allow us to send error codes", function () {

        var a = "a",
            b = "b",
            result;

        _extra.debugging.errors = {
            "0001":function (a, b) {
                return a+b;
            }
        };

        _extra.debugging.error("0001",a,b);

        result = _extra.console.error.calls.argsFor(0)[0];

        expect(result.indexOf(a+b)).toBeGreaterThan(-1);

    });
});