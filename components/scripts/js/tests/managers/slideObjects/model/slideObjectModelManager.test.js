/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 29/10/15
 * Time: 1:09 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for testing _extra.slideObjects.model", function () {

    "use strict";

    var module = unitTests.getModule("slideObjectModelManager");

    beforeEach(function () {

        window._extra = {
            "classes":unitTests.classes,
            "slideObjects":{
                "proxyAutoInstantiator":{
                    "registerModelLookup":jasmine.createSpy("_extra.slideObjects.proxyAutoInstantiator.registerModelLookup"),
                    "check":jasmine.createSpy("_extra.slideObjects.proxyAutoInstantiator.check")
                }
            },
            "slideManager":{
                "hasSlideObjectOnSlide":function () {
                    return true;
                }
            },
            "error":jasmine.createSpy("_extra.error")
        };

        module();
    });

    afterEach(function() {
        delete window._extra;
    });

    it("should define the _extra.slideObjects.model object", function () {
        expect(_extra.slideObjects.model).toBeDefined();
    });

    it("should create a proxy for any objects updated in the model who don't have proxies", function () {

        window._extra.slideObjects.model.write("foobar", "property", true);
        expect(_extra.slideObjects.proxyAutoInstantiator.check).toHaveBeenCalledWith("foobar");

    });

    it("should, on entering a slide, create proxies for objects that have data registered in the model", function () {

        expect(_extra.slideObjects.proxyAutoInstantiator.registerModelLookup).toHaveBeenCalled();

    });
});