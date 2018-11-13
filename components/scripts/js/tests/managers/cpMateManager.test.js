/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 2:13 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.cpMate", function () {

    "use strict";

    var module = unitTests.getModule("cpMateManager");

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.cpMate", function () {
        expect(_extra.cpMate).toBeDefined();
    });

    it("should use cpMate.register to send us signals", function () {

        var spy = jasmine.createSpy("spy"),
            listener = function (data) {
            expect(data).toEqual({
                "action":"hello",
                "parameters":[]
            });
        };

        _extra.cpMate.register("Web_1", listener);
        _extra.cpMate.register("Web_2", spy);

        _extra.cpMate.broadcastTo("Web_1", {
            "action":"hello",
            "parameters":[]
        });

        expect(spy).not.toHaveBeenCalled();

    });

    it("should use cpMate.deregister to stop sending us signals", function () {

        var spy = jasmine.createSpy("spy");

        _extra.cpMate.register("Web_1", spy);
        _extra.cpMate.deregister("Web_1");
        _extra.cpMate.broadcastTo("Web_1", {});

        expect(spy).not.toHaveBeenCalled();

    });
});