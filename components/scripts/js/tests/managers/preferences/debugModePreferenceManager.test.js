/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/11/15
 * Time: 9:48 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.preferences.debugMode", function () {

    "use strict";

    var module = unitTests.getModule("debugModePreferenceManager"),
        info;

    beforeEach(function () {

        window._extra = {
            "classes":unitTests.classes,
            "preferenceManager": {
                "registerPreferenceModule": function (behaviourSuffix, behaviourInfo) {
                    info = behaviourInfo;
                    info.enabled = false;
                    return true;
                }
            },
            "preferences": {

            }
        };


    });

    afterEach(function () {
        delete window._extra;
    });

    it("should register a preference module", function () {

        spyOn(_extra.preferenceManager,"registerPreferenceModule").and.callThrough();
        module();
        expect(_extra.preferenceManager.registerPreferenceModule).toHaveBeenCalled();

    });

    it("should define _extra.preferences.debugMode", function () {

        module();
        expect(_extra.preferences.debugMode).toBeDefined();

    });

    it("should turn _extra.preferences.debugMode on or off when disabled or enabled", function () {

        module();

        info.disable();
        expect(_extra.preferences.debugMode).toBe(false);


        info.enable();
        expect(_extra.preferences.debugMode).toBe(true);

    });
});