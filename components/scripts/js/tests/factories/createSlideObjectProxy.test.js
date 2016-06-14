/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 6:40 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.factories.createSlideObjectProxy", function () {

    "use strict";

    var module = unitTests.getModule("createSlideObjectProxy"),
        dataTypes = unitTests.getModule("globalSlideObjectTypes");

    beforeEach(function () {

        var rawSlideObjectData = {
            "dummy":{
                "name":"dummy",
                "type":-1
            }
        };

        window._extra = {
            "factories":{

            },
            "dataManager": {
                "getSlideObjectDataByName": function (id) {
                    return rawSlideObjectData[id];
                }
            },
            "classes": unitTests.classes
        };

        this.dummyElement = document.createElement("div");
        this.dummyElement.id = "dummy";

        dataTypes();
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.factories.createSlideObjectProxy method", function () {
        expect(_extra.factories.createSlideObjectProxy).toBeDefined();
    });

    it("should return us a general proxy object for an object it can't recognize", function () {
        var result = _extra.factories.createSlideObjectProxy("dummy", this.dummyElement);
        expect(result.DOMElement).toEqual(this.dummyElement);
    });

    it("proxy objects should define: name, type, so on...", function () {
        var result = _extra.factories.createSlideObjectProxy("dummy", this.dummyElement);
        expect(result.name).toBe("dummy");
        expect(result.type).toBe(-1);
    });

});