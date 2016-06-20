/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 6/06/16
 * Time: 11:14 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for timeInfoVariables.js", function () {

    "use strict";

    var module = unitTests.getModule("timeInfoVariables"),
        variables = {
            "xinfoProjectElapsedHours":NaN,
            "xinfoProjectElapsedMinutes":NaN,
            "xinfoProjectElapsedSeconds":NaN,
            "xinfoProjectTotalHours":NaN,
            "xinfoProjectTotalMinutes":NaN,
            "xinfoProjectTotalSeconds":NaN
        };

    function createEvent(name) {
        return {
            "type":name
        };
    }

    beforeEach(function () {

        var that = this,
            PREFIX = "xinfo";
        this.undefinedVariables = {

        };

        window._extra = {
            "classes":unitTests.classes,
            "infoManager":{
                "registerInfoVariable":jasmine.createSpy("_extra.infoManager.registerInfoVariable").and.callFake(function (info) {

                    var actualName = PREFIX + info.suffix;

                    info.name = actualName;

                    return !that.undefinedVariables.hasOwnProperty(actualName);

                })
            },
            "eventManager":{
                "eventDispatcher":new unitTests.classes.EventDispatcher()
            },
            "variableManager": {
                setVariableValue:jasmine.createSpy("_extra.variableManager.setVariableValue").and.callFake(function (name, value) {
                    variables[name] = value;
                })
            },
            "preferences":{
                "doubleDidgits":{
                    "ProjectElapsedSeconds":false,
                    "ProjectElapsedMinutes":false,
                    "ProjectElapsedHours":false,
                    "ProjectTotalSeconds":false,
                    "ProjectTotalMinutes":false,
                    "ProjectTotalHours":false
                }
            },
            "movieStatus":{
                "FPS":30,
                "totalFrames":300,
                "currentFrame":150
            },
            "w":{
                "Math":Math,
                "Event":Event,
                "String":String
            }
        };

        spyOn(_extra.eventManager.eventDispatcher, "addEventListener").and.callThrough();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should register the time variables", function () {

        module();

        var suffixes = ["ProjectTotalHours", "ProjectTotalMinutes", "ProjectTotalSeconds",
                        "ProjectElapsedHours", "ProjectElapsedMinutes", "ProjectElapsedSeconds"],
            suffix;

        for (var i = 0; i < suffixes.length; i += 1) {
            suffix = suffixes[i];

            expect(_extra.infoManager.registerInfoVariable).toHaveBeenCalledWith(jasmine.objectContaining({
                "suffix":suffix
            }));
        }

    });

    it("should register an event listener if any of the elapsed variables exist", function () {

        module();

        expect(_extra.eventManager.eventDispatcher.addEventListener).toHaveBeenCalledWith("newframe", jasmine.any(Function));

    });

    it("should not register an event listener if none of the elapsed variables exist", function () {

        this.undefinedVariables = {
            "xinfoProjectElapsedHours":true,
            "xinfoProjectElapsedMinutes":true,
            "xinfoProjectElapsedSeconds":true
        };

        module();

        expect(_extra.eventManager.eventDispatcher.addEventListener).not.toHaveBeenCalledWith("newframe", jasmine.any(Function));

    });

    it("should accurate calculate the correct total time", function () {

        _extra.movieStatus.FPS = 30;
        _extra.movieStatus.totalFrames = 117060;

        module();

        expect(variables.xinfoProjectTotalHours).toBe("1");
        expect(variables.xinfoProjectTotalMinutes).toBe("5");
        expect(variables.xinfoProjectTotalSeconds).toBe("2");

    });

    it("should accurately calculate the current elapsed time", function () {

        _extra.movieStatus.FPS = 30;
        _extra.movieStatus.currentFrame = 117060;

        module();

        _extra.eventManager.eventDispatcher.dispatchEvent(createEvent("newframe"));

        expect(variables.xinfoProjectElapsedHours).toBe("1");
        expect(variables.xinfoProjectElapsedMinutes).toBe("5");
        expect(variables.xinfoProjectElapsedSeconds).toBe("2");

    });

    it("should force double didgits if preferences demand so", function () {

        _extra.preferences.doubleDidgits.ProjectTotalSeconds = true;
        _extra.preferences.doubleDidgits.ProjectTotalMinutes = true;
        _extra.preferences.doubleDidgits.ProjectTotalHours = true;

        _extra.preferences.doubleDidgits.ProjectElapsedSeconds = true;

        _extra.movieStatus.FPS = 30;
        _extra.movieStatus.totalFrames = 117060;
        _extra.movieStatus.currentFrame = 135060;

        module();

        expect(variables.xinfoProjectTotalHours).toBe("01");
        expect(variables.xinfoProjectTotalMinutes).toBe("05");
        expect(variables.xinfoProjectTotalSeconds).toBe("02");

        _extra.eventManager.eventDispatcher.dispatchEvent(createEvent("newframe"));

        expect(variables.xinfoProjectElapsedHours).toBe("1");
        expect(variables.xinfoProjectElapsedMinutes).toBe("15");
        expect(variables.xinfoProjectElapsedSeconds).toBe("02");

    });
});