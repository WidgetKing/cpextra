/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 4:48 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    function testSlideObjectManager(software, getMockObject) {

        describe("Test suite to test _extra.slideObjects for " + software, function () {


            var a = {
                "dummy": function () {}
                },
                queryEngine = unitTests.getModule("queryManager"),
                softwareModule = unitTests.getModule("slideObjectManager_software", software),
                globalModule = unitTests.getModule("slideObjectManager_global"),
                slideObjectTypes = unitTests.getModule("globalSlideObjectTypes");

            beforeEach(function () {
                spyOn(a, "dummy");
                window._extra = getMockObject();
                queryEngine();
                slideObjectTypes();

                window._extra.dataTypes.convertSlideObjectType = function () {
                    return _extra.dataTypes.slideObjects.TEXT_ENTRY_BOX;
                };
                this.softwareModuleOnLoadCallback = softwareModule();
                globalModule();
            });

            afterEach(function () {
                delete window._extra;
            });




            it("should define the _extra.slideObjects object", function () {
                expect(_extra.slideObjects).toBeDefined();
            });

            it("should send us a callback for all slide objects of a certain type", function () {
                window._extra.slideObjects.allObjectsOfTypeCallback.addCallback(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX, a.dummy);
                this.softwareModuleOnLoadCallback();
                expect(a.dummy).toHaveBeenCalled();
            });

            it("should get a list of all slide objects that match a particular @ sytax name", function () {

                var result = _extra.slideObjects.getSlideObjectNamesMatchingWildcardName("b@");
                expect(result).toEqual(jasmine.arrayContaining(["bar"]));

                result = _extra.slideObjects.getSlideObjectNamesMatchingWildcardName("b@r");
                expect(result).toEqual(jasmine.arrayContaining(["bar"]));

                result = _extra.slideObjects.getSlideObjectNamesMatchingWildcardName("f@");
                expect(result).toEqual(jasmine.arrayContaining(["foo","foobar"]));

                result = _extra.slideObjects.getSlideObjectNamesMatchingWildcardName("zzz@");
                expect(result).toEqual(null);

            });

            it("should, when passing a name into getSlideObjectNamesMatchingWildcardName that has no wildcard, return null", function () {
                var result = _extra.slideObjects.getSlideObjectNamesMatchingWildcardName("foo");
                expect(result).toBe(null);
            });

            it("should allow us to get slide object proxies through the slideManager.getSlideObjectProxy", function () {
                var element = document.createElement("div");
                expect(_extra.slideObjects.getSlideObjectProxy(element).DOMElement).toEqual(element);
                expect(_extra.slideObjects.getSlideObjectProxy("foobar").name).toEqual("foobar");
            });

            it("when requesting the same object from slideManager.getSlideObjectProxy, it should always give us the same proxy object", function () {
                var element = document.createElement("div");
                element.id = "foobar";
                var result = _extra.slideObjects.getSlideObjectProxy(element);
                expect(_extra.slideObjects.getSlideObjectProxy("foobar")).toEqual(result);
            });

            it("slideManager.getSlideObjectProxy should return null if no slide object matches that query", function () {
                expect(_extra.slideObjects.getSlideObjectProxy("SDLFJXXCJKLJ")).toBeNull();
            });

            it("getSlideObjectNamesMatchingWildcardName should be able to return slide object proxies", function () {
                var result = _extra.slideObjects.getSlideObjectNamesMatchingWildcardName("b@r", true);
                expect(result.length).toBe(1);
                expect(result[0].name).toEqual("bar");
            });

            it("should allow us to get slide objects in whole project matching a particular name", function () {

                _extra.slideObjects.projectSlideObjectNames = {
                    "me":true,
                    "you":true,
                    "meyou":true
                };

                var result = _extra.slideObjects.getSlideObjectNamesMatchingWildcardName("me#");
                expect(result.length).toBe(2);
                console.log(result);

            });

            it("should allow you to request slide objects through getSlideObjectByName", function () {
                var result = _extra.slideObjects.getSlideObjectByName("foo");
                expect(result.name).toBe("foo");
            });

            it("should allow you to request wildcard searches through getSlideObjectByName", function () {
                var result = _extra.slideObjects.getSlideObjectByName("@ar");
                expect(result.length).toBe(2);
            });

            it("should define show and hide functions that use @ syntax", function () {
                expect(_extra.slideObjects.hide).toBeDefined();
                expect(_extra.slideObjects.show).toBeDefined();
            });


            it("should define enable and disable functions that use @ syntax", function () {
                expect(_extra.slideObjects.enable).toBeDefined();
                expect(_extra.slideObjects.disable).toBeDefined();
            });

            it("should reset the slideObjectProxy list on entering a new slide and unload slide objects", function () {
                var result = _extra.slideObjects.getSlideObjectByName("foo");
                spyOn(result,"unload");
                _extra.slideManager.enterSlideCallback.sendToCallback("*",0);
                expect(result).not.toBe(_extra.slideObjects.getSlideObjectByName("foo"));
                expect(result.unload).toHaveBeenCalled();
            });

            it("should tell us whether or not a proxy has been created for a particular slide object", function () {
                expect(_extra.slideObjects.hasProxyFor("foo")).toBe(false);
                _extra.slideObjects.getSlideObjectByName("foo");
                expect(_extra.slideObjects.hasProxyFor("foo")).toBe(true);
            });

            it("should tell us if a particular slide object exists in the entire project", function () {
                expect(_extra.slideObjects.hasSlideObjectInProject("foobar")).toBe(true);
                expect(_extra.slideObjects.hasSlideObjectInProject("invalid")).toBe(false);
            });




            ////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////
            //////////////////// ENTER SLIDE
            ////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////
            it("should reset the slideObjectProxy list on entering a new slide", function () {
                var result = _extra.slideObjects.getSlideObjectByName("foo");
                _extra.slideManager.enterSlideCallback.sendToCallback("*",0);
                expect(result).not.toBe(_extra.slideObjects.getSlideObjectByName("foo"));
            });

            it ("should tell callbacks what slide objects are on this new slide", function () {
                _extra.slideObjects.enteredSlideChildObjectsCallbacks.addCallback("*", a.dummy);
                _extra.slideManager.enterSlideCallback.sendToCallback("*",0);
                expect(a.dummy).toHaveBeenCalled();
            });
        });
    }

    testSlideObjectManager(unitTests.CAPTIVATE, function () {
        return {
            "classes": unitTests.classes,
            "dataManager":{
                "getSlideObjectTypeByName": function() {
                    return 1;
                }
            },
            "slideManager":{
                "currentSlideDOMElement":{
                    "childNodes": [
                        {
                            "id":"foo"
                        },
                        {
                            "id":"bar"
                        },
                        {
                            "id":"foobar"
                        }
                    ]
                },
                "enterSlideCallback":new unitTests.classes.Callback(),
                "getSlideData":function () {
                    return {
                        "slideObjects":[
                            "foo","bar","foobar"
                        ]
                    };
                }
            },
            "captivate": {
                "allSlideObjectsData": {
                    "foobar": {
                        "type":24
                    }
                }
            },
            "factories":{
                "createSlideObjectProxy": function(id, DOMElement) {

                    return {
                        "name":id,
                        "DOMElement":DOMElement,
                        "unload":function () {

                        }
                    };
                    //alert("In createSlideObjectProxy proxy function which has yet to be implemented");
                }
            },
            "w":{
                "document":{
                    "getElementById": function (id) {
                        var validNames = {
                            "foo":true,
                            "bar":true,
                            "foobar":true,
                            "dummy":true
                        };

                        if(!validNames[id]) {
                            return;
                        }

                        var element = document.createElement("div");
                        element.id = id;
                        return element;
                    }
                },
                "Array":Array
            }
        };
    });






    /*testSlideObjectManager(unitTests.STORYLINE, {
        "classes": unitTests.classes
    });*/

}());