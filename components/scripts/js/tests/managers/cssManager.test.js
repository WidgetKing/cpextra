/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/10/15
 * Time: 5:22 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for working with _extra.cssManager", function () {

    "use strict";


    var module = unitTests.getModule("cssManager");

    beforeEach(function () {

        this.jQueryObject = {
            "appendTo":function () {

            },
            "addClass": function () {

            },
            "removeClass":function () {

            }
        };
        var jq = this.jQueryObject;

        window._extra = {
            "$":function() {
                return jq;
            }
        };
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.cssManager object", function () {
        expect(_extra.cssManager).toBeDefined();
    });

    it("should define default classes for extra", function () {

    });

    it("should allow us to add and remove classes from a html element", function () {

        var element = document.createElement("div");

        spyOn(this.jQueryObject,"addClass");
        _extra.cssManager.addClassTo(element, "foobar");
        expect(this.jQueryObject.addClass).toHaveBeenCalledWith("foobar");

        spyOn(this.jQueryObject,"removeClass");
        _extra.cssManager.removeClassFrom(element, "foobar");
        expect(this.jQueryObject.removeClass).toHaveBeenCalledWith("foobar");

    });

});