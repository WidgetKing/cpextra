/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/7/19
 * Time: 10:38 AM
 * To change this template use File | Settings | File Templates.
 */
fdescribe("A test suite for _extra.safeEval", function () {

    "use strict";

    var module = unitTests.getModule("safeEval");

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "w":window
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.safeEval", function () {
        expect(_extra.safeEval).toBeDefined();
    });

    it("should run eval on code", function () {

        _extra.test = false;

        _extra.safeEval("_extra.test = true");

        expect(_extra.test).toBe(true);

    });

    it("should not run code if its ID has been run before", function () {

        var ID = "MyID";
        var code = "_extra.test = true";
        _extra.test = false;

        _extra.safeEval(code, ID);

        expect(_extra.test).toBe(true);

        _extra.test = false;

        _extra.safeEval(code, ID);

        expect(_extra.test).toBe(false);

    });
});
