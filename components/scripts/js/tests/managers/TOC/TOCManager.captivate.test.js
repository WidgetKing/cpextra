/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/02/16
 * Time: 11:50 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.TOCManager", function () {

    "use strict";

    var module = unitTests.getModule("TOCManager", unitTests.CAPTIVATE);

    beforeEach(function () {

        var that = this;

        this.data = {
            "0":{
                "complete":false
            },
            "1":{
                "complete":false
            },
            "2":{
                "complete":false
            },
            "3":{
                "complete":false
            },
            "4":{
                "complete":false
            }
        };

        window._extra = {
            "classes":unitTests.classes,
            "slideManager":{
                "numSlides":5,
                "getSlideData":function(index) {
                    return that.data[index];
                },
                "getSlideIndexFromName":function(name) {
                    switch (name) {
                        case "slide1" :
                                return {
                                    "scene":1,
                                    "slide":0
                                };

                        case "slide2" :
                                return {
                                    "scene":1,
                                    "slide":1
                                };

                        case "slide3" :
                                return {
                                    "scene":1,
                                    "slide":2
                                };

                        case "slide4" :
                                return {
                                    "scene":1,
                                    "slide":3
                                };

                        case "slide5" :
                                return {
                                    "scene":1,
                                    "slide":4
                                };

                        default :
                                return null;
                    }
                }
            },
            "captivate":{
                "api":{
                    "markTOCEntryComplete":jasmine.createSpy("captivate.api.markTOCEntryComplete")
                }
            },
            "error":jasmine.createSpy("_extra.error"),
            "w":{
                "parseInt":parseInt,
                "isNaN":isNaN
            },
            "log":function () {}
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.TOCManager", function () {
        expect(_extra.TOCManager).toBeDefined();
    });

    it("should allow us to mark slides as completed in the TOC", function () {

        _extra.TOCManager.completeSlide(3);
        expect(_extra.captivate.api.markTOCEntryComplete).toHaveBeenCalledWith(2);
        expect(this.data[2].complete).toBe(true);

    });

    it("should allow us to mark slides by slide name", function () {

        _extra.TOCManager.completeSlide("slide3");
        expect(_extra.captivate.api.markTOCEntryComplete).toHaveBeenCalledWith(2);

    });

    it("should allow us to mark a range of slides as completed in the TOC", function () {

        _extra.TOCManager.completeSlide("3-5");
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(0)).toEqual([2]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(1)).toEqual([3]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(2)).toEqual([4]);

    });

    it("should allow us to use a backwards range like 5 - 3", function () {

        _extra.TOCManager.completeSlide("5-3");
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(0)).toEqual([2]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(1)).toEqual([3]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(2)).toEqual([4]);

    });

    it("should complete a single slide with a range like: 3-3", function () {

        _extra.TOCManager.completeSlide("3-3");
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(0)).toEqual([2]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.count()).toEqual(1);

    });

    it("should allow us to mark a range of slides, sent as slide names, to be completed in the TOC", function () {

        _extra.TOCManager.completeSlide("slide3-slide5");
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(0)).toEqual([2]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(1)).toEqual([3]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(2)).toEqual([4]);

    });

    it("should allow us to mark a range of slides with a combination of numbers a slide names", function () {

        _extra.TOCManager.completeSlide("slide3-5");
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(0)).toEqual([2]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(1)).toEqual([3]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(2)).toEqual([4]);

    });

    it("should allow mark all slides if we pass it 'all' as a parameter", function () {

        _extra.TOCManager.completeSlide("ALL");
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(0)).toEqual([0]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(1)).toEqual([1]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(2)).toEqual([2]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(3)).toEqual([3]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.argsFor(4)).toEqual([4]);
        expect(_extra.captivate.api.markTOCEntryComplete.calls.count()).toEqual(5);

    });

    it("should throw an error if we give it an invalid value", function () {

        _extra.TOCManager.completeSlide("3-5-7");
        expect(_extra.error.calls.argsFor(0)[0]).toEqual("CV070");
        expect(_extra.captivate.api.markTOCEntryComplete).not.toHaveBeenCalled();

    });

    it("should throw an error if we give it an invalid slide name", function () {

        _extra.TOCManager.completeSlide("slideFOOBAR");
        expect(_extra.error.calls.argsFor(0)[0]).toEqual("CV071");
        expect(_extra.captivate.api.markTOCEntryComplete).not.toHaveBeenCalled();

    });

    it("should throw an error if we give it an invalid slide name within a range", function () {

        _extra.TOCManager.completeSlide("1-slideFOOBAR");
        expect(_extra.error.calls.argsFor(0)[0]).toEqual("CV071");
        expect(_extra.captivate.api.markTOCEntryComplete).not.toHaveBeenCalled();

    });

    it("should throw an error if we give it a slide number outside the maximum number of slides", function () {

        _extra.TOCManager.completeSlide(_extra.slideManager.numSlides + 1);
        expect(_extra.error.calls.argsFor(0)[0]).toEqual("CV072");
        expect(_extra.captivate.api.markTOCEntryComplete).not.toHaveBeenCalled();

        _extra.error.calls.reset();
        _extra.TOCManager.completeSlide(_extra.slideManager.numSlides);
        expect(_extra.captivate.api.markTOCEntryComplete).toHaveBeenCalled();

    });


});