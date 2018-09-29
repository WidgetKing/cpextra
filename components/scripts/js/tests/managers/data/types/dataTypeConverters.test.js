/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/10/15
 * Time: 2:38 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    function dataTypeConvertersTests(software,types) {

        describe("A test suite for the data type converters in " + software, function () {

            var module = unitTests.getModule("dataTypeConverters",software);
            var dataTypes = unitTests.getModule("globalSlideObjectTypes");

            beforeEach(function () {
                window._extra = {
                    "log": jasmine.createSpy("_extra.log"),
                    "debugging":{
                        "mode":true
                    }
                };
                dataTypes();
                module();
            });

            afterEach(function () {
                delete window._extra;
            });

            it("should define a convertSlideObjectType method which converts " + software + " data values to a global type", function () {
                expect(_extra.dataTypes.convertSlideObjectType).toBeDefined();
                expect(_extra.dataTypes.convertSlideObjectType(types.TEXT_ENTRY_BOX)).toEqual(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX);
            });

            it("should return an _extra.dataTypes.slideObjects.UNKNOWN if this data type isn't yet registered", function () {
                expect(_extra.dataTypes.convertSlideObjectType(999)).toEqual(_extra.dataTypes.slideObjects.UNKNOWN);
            });

        });


    }
    dataTypeConvertersTests(unitTests.CAPTIVATE, {"TEXT_ENTRY_BOX":24});
    //dataTypeConvertersTests(unitTests.STORYLINE, {"TEXT_ENTRY_BOX":24});

}());