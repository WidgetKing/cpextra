/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 14/06/16
 * Time: 1:25 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the whiteSpaceManager module", function () {

    "use strict";

    var module = unitTests.getModule("whiteSpaceManager");

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "variableManager":{

            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });


    it("should be able to remove spaces from a string, without removing them from inside double quotes", function () {

        var result = _extra.variableManager.safelyRemoveWhiteSpace('   "foo bar"   ');
        expect(result).toBe('"foo bar"');

    });

    it("should when removing spaces allow us to choose something to replace commas with", function () {

        var result = _extra.variableManager.safelyRemoveWhiteSpace(' hello ,  "foo, bar", world   ',"#");
        expect(result).toBe('hello#"foo, bar"#world');

    });
});