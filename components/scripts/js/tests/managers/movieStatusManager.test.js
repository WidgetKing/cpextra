/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/06/16
 * Time: 9:59 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.movieStatus", function () {

    "use strict";

    var module = unitTests.getModule("movieStatusManager", unitTests.CAPTIVATE),
        variables;

    beforeEach(function () {

        var variableChangeListeners = {

        };

        variables = {

        };

        window._extra = {
            "w":{
                "Math":Math
            },
            "createEvent":function (name){
                return {
                    "type":name
                };
            },
            "classes":unitTests.classes,
            "captivate":{
                "FPS":30,
                "totalFrames":100,
                "movie":{
                    "paused":false
                }
            },
            "variableManager":{
                "getVariableValue":function (name) {
                    return variables[name];
                },
                "setVariableValue": function (name, value) {
                    variables[name] = value;

                    if (variableChangeListeners[name]) {
                        variableChangeListeners[name]();
                    }
                },
                "listenForVariableChange": function (name, method) {
                    variableChangeListeners[name] = method;
                }
            },
            "eventManager":{
                "eventDispatcher":{
                    "dispatchEvent":jasmine.createSpy("eventManager.eventDispatcher.dispatchEvent")
                }
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.movieStatus object", function () {
        expect(_extra.movieStatus).toBeDefined();
    });

    it("should be able to tell us if the movie is currently playing or paused", function () {

        expect(_extra.movieStatus.isPlaying()).toBe(true);
        expect(_extra.movieStatus.isPaused()).toBe(false);

    });

    it("should read the FPS and total frames for the movie", function () {

        expect(_extra.movieStatus.FPS).toEqual(_extra.captivate.FPS);
        expect(_extra.movieStatus.totalFrames).toEqual(_extra.captivate.totalFrames);

    });

    it("should update the currentFrame variable AND dispatch an event when the frame updates", function () {

        expect(_extra.eventManager.eventDispatcher.dispatchEvent).not.toHaveBeenCalled();

        _extra.variableManager.setVariableValue("cpInfoCurrentFrame", 12);
        expect(_extra.movieStatus.currentFrame).toBe(12);

        expect(_extra.eventManager.eventDispatcher.dispatchEvent).toHaveBeenCalled();

    });

    it("shouldn't let current frame exceed the maximum number of frames", function () {

        _extra.captivate.totalFrames = 100;

        _extra.variableManager.setVariableValue("cpInfoCurrentFrame", 101);
        expect(_extra.movieStatus.currentFrame).toBe(100);

    });
});