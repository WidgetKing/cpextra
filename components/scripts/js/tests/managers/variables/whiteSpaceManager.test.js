/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 14/06/16
 * Time: 1:25 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the whiteSpaceManager module", function () {

    "use strict";

    var module = unitTests.getModule("whiteSpaceManager"),
        string,
        result;

    beforeEach(function () {

        string = "";
        result = null;

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

        string = '   [foo bar]   ';
        result = _extra.variableManager.safelyRemoveWhiteSpace(string);
        expect(result).toBe('[foo bar]');

    });

    it("should when removing spaces allow us to choose something to replace commas with", function () {

        string = ' hello ,  [foo, bar], world   ';
        result = _extra.variableManager.safelyRemoveWhiteSpace(string,"#");
        expect(result).toBe('hello#[foo, bar]#world');

    });

    it("should remove spaces correctly in longer strings", function () {

        string = '[MyVar Equals: $$v_Message$$]';
        result = _extra.variableManager.safelyRemoveWhiteSpace(string);
        expect(result).toBe('[MyVar Equals: $$v_Message$$]');

    });
});