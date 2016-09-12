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

            var softwareModule = unitTests.getModule("stateManager_software", software),
                hookModule = unitTests.getModule("hookManager"),
                globalModule = unitTests.getModule("stateManager_global");

            beforeEach(function () {
                window._extra = getMockObject();

                this.a = {
                    "dummy":jasmine.createSpy("dummy"),
                    "notherDummy":jasmine.createSpy("notherDummy")
                };

                hookModule();
                softwareModule();
                globalModule();

                _extra.slideObjects.states.callOnStateDrawn = function(name, method) {
                    method();
                };
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
                _extra.getNativeControllerByName("foo").drawComplete();

                expect(this.a.dummy).toHaveBeenCalled();
                expect(this.a.notherDummy).not.toHaveBeenCalled();

                _extra.slideObjects.states.change("foobar","valid");
                _extra.getNativeControllerByName("foobar").drawComplete();

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

        function createNativeController() {
            return {
                "drawComplete":function () {

                }
            }
        }

        var uid = {
                "foo":1,
                "foobar":2,
                "bar":3
            },
            nativeControllers = {
                "1":createNativeController(),
                "2":createNativeController(),
                "3":createNativeController()
            };

        return {
            "getNativeControllerByName":function (name) {
                return nativeControllers[uid[name]];
            },
            "captivate":{
                "api":{
                    "changeState":function () {

                    },
                    "getDisplayObjByCP_UID": function (uid) {
                        return nativeControllers[uid];
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
                "getSlideObjectDataByName":function (slideObjectName) {
                    return {
                        "hasState":function(stateName) {
                            return stateName === "valid" || stateName === "Normal";
                        },
                        "uid":uid[slideObjectName]
                    };
                }
            },
            "classes":unitTests.classes
        };
    });

    /*stateManagerTests(unitTests.STORYLINE, function () {

    });*/
}());