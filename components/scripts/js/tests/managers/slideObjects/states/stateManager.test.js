/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/10/15
 * Time: 7:25 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";


    function stateManagerTests(software, getMockObject) {

        describe("A test suite for _extra.slideObjects.states in " + software, function () {

            var softwareModule = unitTests.getModule("stateManager_software", software);
            var globalModule = unitTests.getModule("stateManager_global");

            beforeEach(function () {
                window._extra = getMockObject();

                this.a = {
                    "dummy":jasmine.createSpy("dummy"),
                    "notherDummy":jasmine.createSpy("notherDummy")
                };

                softwareModule();
                globalModule();
            });

            afterEach(function () {
                delete window._extra;
            });

            it("should define the _extra.slideObjects.states object", function () {
                expect(_extra.slideObjects.states).toBeDefined();
            });

            it("should be able to notify us if a particular slide object's state has been changed", function () {
                _extra.slideObjects.states.changeCallback.addCallback("*", this.a.dummy);
                _extra.slideObjects.states.changeCallback.addCallback("foobar", this.a.notherDummy);

                _extra.slideObjects.states.change("foo","valid");

                expect(this.a.dummy).toHaveBeenCalled();
                expect(this.a.notherDummy).not.toHaveBeenCalled();

                _extra.slideObjects.states.change("foobar","valid");

                expect(this.a.notherDummy).toHaveBeenCalled();
            });

            it("should not notify us if Captivate tries to display an invalid state", function () {

                _extra.slideObjects.states.changeCallback.addCallback("*", this.a.dummy);

                _extra.slideObjects.states.change("foo","invalid");

                expect(this.a.dummy).not.toHaveBeenCalled();

            });
        });
    }








    stateManagerTests(unitTests.CAPTIVATE, function () {
        return {
            "captivate":{
                "api":{
                    "changeState":function () {

                    }
                }
            },
            "slideObjects": {
                "changeState":function () {

                },
                "enactFunctionOnSlideObjects":function (query, method) {
                    method(query);
                }
            },
            "dataManager":{
                "getSlideObjectDataByName":function () {
                    return {
                        "hasState":function(stateName) {
                            return stateName === "valid" || stateName === "Normal";
                        }
                    }
                }
            },
            "classes":unitTests.classes
        };
    });

    /*stateManagerTests(unitTests.STORYLINE, function () {

    });*/
}());