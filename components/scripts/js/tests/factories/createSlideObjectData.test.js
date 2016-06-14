/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 4:36 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    function projectDataFactoryTests() {

        describe("A test suite to test _extra.factories.createSlideObjectData() method", function () {

            var module = unitTests.getModule("createSlideObjectData");
            var dataTypes = unitTests.getModule("globalSlideObjectTypes");

            this.textEntryBoxData = {
                "type":24
            };

            beforeEach(function () {

                this.textEntryBoxData = {
                    "base":{

                    },
                    "container":{
                        "txt":"default"
                    }
                };

                window._extra = {
                    "factories": {

                    },
                    "classes":unitTests.classes
                };

                dataTypes();
                module();

            });

            afterEach(function () {
                delete window._extra;
            });

            it("should define a createSlideObjectData() function", function () {
                expect(_extra.factories.createSlideObjectData).toBeDefined();
            });

            it("should return a proxy data object matching its object type", function () {
                var result = _extra.factories.createSlideObjectData("foobar", this.textEntryBoxData,_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX);
                expect(result.name).toEqual("foobar");
            });

            it("should return a base slide object data proxy if it can't identify the specific object type", function () {
                var result = _extra.factories.createSlideObjectData("foobar", this.textEntryBoxData, 999);
                expect(result).not.toBeNull();
                //expect(result).toEqual(_extra.classes.BaseSlideObjectDataProxy.prototype);
            });

            it("the proxy should expose its object type number according to Extra's global types", function () {
                var result = _extra.factories.createSlideObjectData("foobar", this.textEntryBoxData,_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX);
                expect(result.type).toEqual(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX);
            });
        });

    }

    projectDataFactoryTests();

}());