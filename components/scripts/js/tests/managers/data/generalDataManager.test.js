/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 3:55 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    function dataManagerTests(software, mockObject) {

        describe("A test suite for the data manager in " + software, function () {
            var module = unitTests.modules["generalDataManager_" + software];
            var globalDataTypes = unitTests.getModule("globalSlideObjectTypes");

            beforeEach(function () {

                window._extra = mockObject;
                globalDataTypes();
                _extra.dataTypes.convertSlideObjectType = function (type) {
                    return type;
                };
                this.onLoadCallback = module();

            });

            afterEach(function () {
                delete window._extra;
            });

            it("should define the dataManager object", function () {
                expect(_extra.dataManager).toBeDefined();
            });

            it("should define a getSlideObjectDataByName method which returns a formatted data object", function () {
                expect(_extra.dataManager.getSlideObjectDataByName).toBeDefined();
                var result = _extra.dataManager.getSlideObjectDataByName("foobar");
                expect(result.name).toEqual("foobar");
            });

            it("should allow us to send it a slide object name and it will return its data type", function () {

                expect(_extra.dataManager.getSlideObjectTypeByName("foobar")).toBe(24);

            });

        });

    }

    dataManagerTests(unitTests.CAPTIVATE, {
        "captivate": {
            "model": {
                "data": {
                    "foobar": {
                        "type": 24 // Text entry box
                    }
                }
            },
            "allSlideObjectsData":{
                "foobar": {
                    "type": 24 // Text entry box
                }
            }
        },
        "factories":{
            "createSlideObjectData":function (name,data,type) {
                return {
                    "name":name,
                    "data":data,
                    "type":type
                };
            }
        },
        "log": function () {

        },
        "classes":unitTests.classes
    });
    //dataManagerTests(unitTests.STORYLINE, unitTests.getStorylineMockObject());

}());