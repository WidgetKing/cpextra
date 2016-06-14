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
        _extra.actionManager.callActionOn("invalid", true);
        expect(_extra.error).toHaveBeenCalled();
    });

    it("should inform us when we try to call an action on a non-interactive object", function () {
        _extra.actionManager.callActionOn("normalObject", true);
        expect(_extra.captivate.movie.executeAction).not.toHaveBeenCalled();
        expect(_extra.error).toHaveBeenCalled();
    });

    it("should allow us to call the success or failure advanced action on a particular object", function () {

        _extra.actionManager.callActionOn("interactiveObject", true);
        expect(_extra.captivate.movie.executeAction).toHaveBeenCalledWith("success");
        _extra.actionManager.callActionOn("interactiveObject", false);
        expect(_extra.captivate.movie.executeAction).toHaveBeenCalledWith("failure");

    });

    it("should interpret strings as certain criteria types", function () {
        _extra.actionManager.callActionOn("interactiveObject","SUCCESS");
        expect(_extra.captivate.movie.executeAction).toHaveBeenCalledWith("success");
        _extra.actionManager.callActionOn("interactiveObject","faIlure");
        expect(_extra.captivate.movie.executeAction).toHaveBeenCalledWith("failure");
        _extra.captivate.movie.executeAction.calls.reset();

        _extra.actionManager.callActionOn("interactiveObject","1");
        expect(_extra.captivate.movie.executeAction).toHaveBeenCalledWith("success");
        _extra.actionManager.callActionOn("interactiveObject","0");
        expect(_extra.captivate.movie.executeAction).toHaveBeenCalledWith("failure");
        _extra.captivate.movie.executeAction.calls.reset();

        /*_extra.actionManager.callActionOn("interactiveObject","foobar");
        expect(_extra.captivate.movie.executeAction).not.toHaveBeenCalled();
        expect(_extra.error).toHaveBeenCalled();*/

    });

    it("should be able to call onFocusLost actions on Text Entry Boxes", function () {

        _extra.actionManager.callActionOn("TEB", "FOCUSLOST");
        expect(_extra.captivate.movie.executeAction).toHaveBeenCalledWith("focus_lost");
        _extra.captivate.movie.executeAction.calls.reset();

        _extra.actionManager.callActionOn("TEB", "FOCUS_LOST");
        expect(_extra.captivate.movie.executeAction).toHaveBeenCalledWith("focus_lost");
        _extra.captivate.movie.executeAction.calls.reset();

        _extra.actionManager.callActionOn("TEB", "FOCUS");
        expect(_extra.captivate.movie.executeAction).toHaveBeenCalledWith("focus_lost");
        _extra.captivate.movie.executeAction.calls.reset();

        _extra.actionManager.callActionOn("interactiveObject", "focuslost");
        expect(_extra.captivate.movie.executeAction).not.toHaveBeenCalled();
        expect(_extra.error).toHaveBeenCalled();

    });

    it("should send an error if it can't interpret what the action criteria is", function () {

        _extra.actionManager.callActionOn("interactiveObject", new Date());
        expect(_extra.captivate.movie.executeAction).not.toHaveBeenCalled();
        expect(_extra.error).toHaveBeenCalled();

    });
});