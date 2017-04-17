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


});