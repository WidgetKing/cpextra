/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 2:06 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    function executeSlideManagerTests(software, getMockObject) {

        describe("A test suite for testing _extra.slideManager in " + software, function () {

            var softwareModule = unitTests.getModule("slideManager_software", software),
                globalModule = unitTests.getModule("slideManager_global");


            beforeAll(function () {
                unitTests.setSoftwareClassAsMain("SlideDataProxy", software);
            });

            beforeEach(function () {
                window._extra = getMockObject();
                _extra.classes = unitTests.classes;
                softwareModule();
                globalModule();
            });

            afterEach(function () {
                delete window._extra;
            });

            it("should define the _extra.slideManager object", function () {
                expect(_extra.slideManager).toBeDefined();
            });

            it("should allow access to a list of all slide names", function () {

                expect(_extra.slideManager.getSlideName(0)).toBe("foo");
                expect(_extra.slideManager.getSlideName(1)).toBe("bar");

                if (_extra.storyline) {
                    expect(_extra.slideManager.getSlideName("0.0")).toBe("storylineDefault");
                }

            });

            it("should allow us to get the slide index from the slide name", function () {
                expect(_extra.slideManager.getSlideIndexFromName("foo")).toEqual(jasmine.objectContaining({
                    "scene":1,
                    "slide":0
                }));

                expect(_extra.slideManager.getSlideIndexFromName("invalid")).toEqual(null);
            });

            it("should allow us to access slide data through a proxy object", function () {
                var data = _extra.slideManager.getSlideData("foo");
                expect(data.name).toBe("foo");
                data = _extra.slideManager.getSlideData(1);
                expect(data.name).toBe("bar");
                data = _extra.slideManager.getSlideData("wrong");
                expect(data).toBe(null);
                data = _extra.slideManager.getSlideData("1.1");
                expect(data.name).toBe("bar");
            });

            it("should return us the current slide number through getCurrentSlideNumber()", function () {
                expect(_extra.slideManager.getCurrentSlideNumber()).toBe(2);
            });

            it("should return us the current scene number through getCurrentSceneNumber()", function () {
                expect(_extra.slideManager.getCurrentSceneNumber()).toBe(1);
            });

            it("should return us the scene number and slide number mixed in as a slide ID", function () {
                expect(_extra.slideManager.currentSlideID).toBe("0.0");
            });



            // There are some tests we haven't implemented yet.
            if (software !== unitTests.STORYLINE) {


                it("should tell us if a particular slide object is on this slide", function () {
                    expect(_extra.slideManager.hasSlideObjectOnSlide("foobar")).toBe(true);
                    expect(_extra.slideManager.hasSlideObjectOnSlide("foo")).toBe(false);
                });


                it("should inform us of when we enter a new slide", function () {
                    var a = {
                        dummy: function () {},
                        slide3:function () {},
                        slide4:function () {},
                        slide0point3: function () {}
                    };
                    spyOn(a,"dummy");
                    spyOn(a,"slide3");
                    spyOn(a,"slide4");
                    spyOn(a,"slide0point3");

                    spyOn(_extra.slideManager, "getCurrentSceneNumber").and.returnValue(0);
                    spyOn(_extra.slideManager, "getCurrentSlideNumber").and.returnValue(3);

                    _extra.slideManager.enterSlideCallback.addCallback("*", a.dummy);
                    _extra.slideManager.enterSlideCallback.addCallback(3, a.slide3);
                    _extra.slideManager.enterSlideCallback.addCallback(4, a.slide4);
                    _extra.slideManager.enterSlideCallback.addCallback("0.3", a.slide0point3);
                    _extra.dispatchEnterSlide();
                    expect(a.dummy).toHaveBeenCalledWith("0.3");
                    expect(a.slide3).toHaveBeenCalledWith("0.3");
                    expect(a.slide4).not.toHaveBeenCalled();
                    expect(a.slide0point3).toHaveBeenCalledWith("0.3");

                });


                it("should allow us to listen for specific slides in specific scenes", function () {
                    var a = {
                        dummy: function () {},
                        notherDummy:function () {}
                    };
                    spyOn(a,"dummy");
                    spyOn(a,"notherDummy");

                    spyOn(_extra.slideManager, "getCurrentSceneNumber").and.returnValue(3);
                    spyOn(_extra.slideManager, "getCurrentSlideNumber").and.returnValue(4);

                    _extra.slideManager.enterSlideCallback.addCallback("3.4", a.dummy);
                    _extra.slideManager.enterSlideCallback.addCallback(4, a.notherDummy);

                    _extra.dispatchEnterSlide();

                    expect(a.dummy).toHaveBeenCalled();
                    expect(a.notherDummy).not.toHaveBeenCalled();

                });

                it("should update _extra.slideManager.currentSlideNumber when entering a new slide", function () {

                    spyOn(_extra.slideManager,"getCurrentSlideNumber").and.returnValue(4);
                    spyOn(_extra.slideManager,"getCurrentSceneNumber").and.returnValue(8);

                    _extra.dispatchEnterSlide();

                    expect(_extra.slideManager.currentSlideNumber).toBe(4);
                    expect(_extra.slideManager.currentSceneNumber).toBe(8);
                });



                it("should create a software customized enter_slide event listener", function () {
                    var a = {
                        dummy: function () {}
                    };
                    spyOn(a,"dummy");

                    _extra.slideManager.addEnterSlideEventListener(a.dummy);
                    _extra.dispatchEnterSlide();
                    expect(a.dummy).toHaveBeenCalled();
                });

                it("should alert callbacks to entering a new slide", function () {
                    var a = {
                        dummy: function () {}
                    };
                    spyOn(a,"dummy");

                    _extra.slideManager.enterSlideCallback.addCallback("*", a.dummy);
                    _extra.dispatchEnterSlide();

                    expect(a.dummy).toHaveBeenCalled();
                });

                it("should define a _extra.slideManager.currentSlideDOMElement property", function () {
                    expect(_extra.slideManager.currentSlideDOMElement).toBeDefined();
                });

            }

        });

    }

    executeSlideManagerTests(unitTests.CAPTIVATE, function () {
        return {
            "captivate": {
                "model":{
                    "data":{
                        "project_main":{
                            "slides":"slide1,slide2"
                        },
                        "slide1":{
                            "lb":"foo"
                        },
                        "slide2":{
                            "lb":"bar"
                        },
                        "foobar":{
                            "apsn": "slide1"
                        },
                        "foo":{
                            "apsn":"slide2"
                        }
                    }
                },
                "eventDispatcher": document.createElement("div"),
                "events":{
                    "SLIDE_ENTER":"slide_enter"
                },
                "variables":{
                    "cpInfoCurrentSlideIndex":2
                }
            },
            "w":{
                "document":{
                    "getElementById":function () {
                        return document.createElement("div");
                    }
                },
                "Event":Event,
                "isNaN":isNaN,
                "parseInt":parseInt
            },
            "eventManager":{
                "eventDispatcher": document.createElement("div")
            },
            "dispatchEnterSlide": function () {
                _extra.captivate.eventDispatcher.dispatchEvent(new unitTests.classes.CustomEvent(_extra.captivate.events.SLIDE_ENTER));
            },
            "createEvent": function (name) {
                return new unitTests.classes.CustomEvent(name);
            }
        };
    });
    executeSlideManagerTests(unitTests.STORYLINE, function () {
        return {
            "w":{
                "isNaN":isNaN,
                "parseInt":parseInt
            },
            "storyline":{
                "slidesData":[
                    {
                        "title":"storylineDefault",
                        "sceneIndex":0,
                        "sceneSlideIndex":0
                    },
                    {
                        "title":"foo",
                        "sceneIndex":1,
                        "sceneSlideIndex":0
                    },
                    {
                        "title":"bar",
                        "sceneIndex":1,
                        "sceneSlideIndex":1
                    }
                ],
                "player":{
                    currentSlide:function() {
                        return {
                            "sceneIndex":1,
                            "sceneSlideIndex":2,
                            "slideIndex":2
                        };
                    }
                }
            },
            "createEvent": function (name) {
                return new unitTests.classes.CustomEvent(name);
            },
            "error":console.log
        };
    });


}());