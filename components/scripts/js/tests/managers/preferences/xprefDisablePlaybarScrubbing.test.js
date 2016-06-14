/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/11/15
 * Time: 9:19 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for xprefDisablePlaybarScrubbing", function () {

    "use strict";

    var module = unitTests.getModule("xprefDisablePlaybarScrubbing",unitTests.CAPTIVATE),
        info;



    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "cssManager":{
                "addClassTo": jasmine.createSpy("_extra.cssManager.addClassTo"),
                "removeClassFrom": jasmine.createSpy("_extra.cssManager.removeClassFrom")
            },
            "preferenceManager": {
                "registerPreferenceModule": function (behaviourSuffix, behaviourInfo) {
                    info = behaviourInfo;
                    info.enabled = true;
                    return true;
                }
            },
            "captivate":{
                "playbar":{
                    "scrubbing":true
                }
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should add and remove a class to the playbar object", function () {

        info.enable();
        expect(_extra.captivate.playbar.scrubbing).toBe(false);


        info.disable();
        expect(_extra.captivate.playbar.scrubbing).toBe(true);

    });
});