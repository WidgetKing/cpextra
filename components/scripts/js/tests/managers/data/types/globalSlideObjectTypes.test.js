/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 4:53 PM
 * To change this template use File | Settings | File Templates.
 */
describe("Test suite to test _extra.slideObjects.types", function () {

    var module = unitTests.getModule("globalSlideObjectTypes");

    beforeEach(function () {
        window._extra = {
        };
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.dataTypes object", function () {
        expect(_extra.dataTypes).toBeDefined();
        expect(_extra.dataTypes.slideObjects).toBeDefined();
    });


});