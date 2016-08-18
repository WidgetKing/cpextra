/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/5/16
 * Time: 3:04 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.audioManager", function () {

    "use strict";

    var module = unitTests.getModule("audioManager", unitTests.CAPTIVATE),
        hookModule = unitTests.getModule("hookManager");

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "captivate":{
                "audioManager": {
                    "allocAudioChannel": jasmine.createSpy("audioManager.allocAudioChannel").and.callFake(function (data) {
                        _extra.captivate.audioManager.objectAudios.currentSlide[data.id] = data;
                    }),
                    "objectAudios":{
                        "currentSlide":{

                        }
                    }
                }
            },
            "slideManager":{
                "currentInternalSlideId":"currentSlide"
            },
            "foo":jasmine.createSpy("_extra.foo"),
            "w":{
                "Object":Object
            }
        };


        hookModule();
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.audioManager object", function () {
        expect(_extra.audioManager).toBeDefined();
    });

    it("should allow us to add callbacks for the native audio object", function () {

        var dummy = jasmine.createSpy("dummy"),
            audioData = {
                "id":"foobar",
                "nativeAudio":{}
            };

        _extra.audioManager.audioDataCallback.addCallback("foobar", dummy);

        _extra.captivate.audioManager.allocAudioChannel(audioData);

        expect(dummy).toHaveBeenCalledWith(audioData);

    });

    it("should immediately send us the native audio object if it's already been set", function () {

        var dummy = jasmine.createSpy("dummy"),
            audioData = {
                "id":"foobar",
                "nativeAudio":{}
            };

        _extra.captivate.audioManager.allocAudioChannel(audioData);

        _extra.audioManager.audioDataCallback.addCallback("foobar", dummy);

        expect(dummy).toHaveBeenCalledWith(audioData);

    });
});