/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 4:27 PM
 * To change this template use File | Settings | File Templates.
 */
describe("Test suite to test _extra.factories", function () {

    "use strict";

    var module = unitTests.modules.factoryManager;

    beforeEach(function () {
        window._extra = {};
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.factories object", function () {
        expect(_extra.factories).toBeDefined();
    });


});