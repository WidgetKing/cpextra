/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/11/15
 * Time: 4:04 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.actionManager", function () {

    var module = unitTests.getModule("actionManager", unitTests.CAPTIVATE);

    beforeEach(function () {

        var datas = {
            "interactiveObject": {
                "isInteractiveObject":true,
                "successAction":"success",
                "failureAction":"failure"
            },
            "normalObject": {
                "isInteractiveObject": false
            },
            "TEB": {
                "isInteractiveObject":true,
                "successAction":"success",
                "failureAction":"failure",
                "focusLostAction":"focus_lost"
            }
        };

        window._extra = {

            "w":{
                "parseInt":parseInt,
                "isNaN":isNaN
            },
            "dataManager":{
                "getSlideObjectDataByName":function(name) {
                    return datas[name];
                }
            },
            "captivate":{
                "movie":{
                    "executeAction":jasmine.createSpy("Captivate's internal executeAction methoed")
                }
            },
            "error":jasmine.createSpy("error"),
            "log":jasmine.createSpy("log")

        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.actionManager", function () {
        expect(_extra.actionManager).toBeDefined();
    });

    it("should inform us when we pass it a slide object that doesn't exist", function () {
        _extra.actionManager.callActionOn("invalid", "success");
        expect(_extra.error).toHaveBeenCalled();
    });

    it("should inform us when we try to call an action on a non-interactive object", function () {
        _extra.actionManager.callActionOn("normalObject", "success");
        expect(_extra.captivate.movie.executeAction).not.toHaveBeenCalled();
        expect(_extra.error).toHaveBeenCalled();
    });

    it("should interpret strings as certain criteria types", function () {

        _extra.actionManager.callActionOn("interactiveObject","success");
        expect(_extra.captivate.movie.executeAction).toHaveBeenCalledWith("success");
        _extra.actionManager.callActionOn("interactiveObject","failure");
        expect(_extra.captivate.movie.executeAction).toHaveBeenCalledWith("failure");

    });

    it("should be able to call onFocusLost actions on Text Entry Boxes", function () {

        _extra.actionManager.callActionOn("interactiveObject", "focuslost");
        expect(_extra.captivate.movie.executeAction).not.toHaveBeenCalled();
        expect(_extra.error).toHaveBeenCalled();

    });
});