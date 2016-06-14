/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 1:03 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the double click delay preference", function () {

    "use strict";

    var module = unitTests.getModule("doubleClickDelayPreference"),
        info;

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "preferenceManager": {
                "registerPreferenceModule": function (behaviourSuffix, behaviourInfo) {
                    info = behaviourInfo;
                    info.enabled = true;
                    return true;
                }
            },
            "preferences": {

            },
            "w":{
                "parseFloat":parseFloat,
                "isNaN":isNaN
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.preferences.doubleClickDelay", function () {
        expect(_extra.preferences.doubleClickDelay).toEqual(0);
    });

    it("should convert the variable value to milliseconds", function () {

        info.update("0.5");
        expect(_extra.preferences.doubleClickDelay).toBe(500);

    });


    it("should disable itself if given an invalid value", function () {

        info.update("invalid");
        expect(_extra.preferences.doubleClickDelay).toBe(0);

    });
});