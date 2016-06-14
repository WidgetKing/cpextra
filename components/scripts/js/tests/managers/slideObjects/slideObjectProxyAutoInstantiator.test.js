/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 9:30 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.slideObjects.proxyAutoInstantiator", function () {

    "use strict";

    var module = unitTests.getModule("slideObjectProxyAutoInstantiator");

    beforeEach(function () {

        var proxies = {

        },
            objectsInProject = {
                "existing":true,
                "onslide":true
        };

        window._extra = {
            "classes":unitTests.classes,
            "slideObjects": {
                "enteredSlideChildObjectsCallbacks": new unitTests.classes.Callback(),
                "getSlideObjectProxy": jasmine.createSpy("_extra.slideObjects.getSlideObjectProxy").and.callFake(function (name) {
                    proxies[name] = true;
                }),
                "hasProxyFor":function (name) {
                    return proxies[name];
                },
                "hasSlideObjectInProject": function (name) {
                    return objectsInProject.hasOwnProperty(name);
                }
            },
            "slideManager": {
                "hasSlideObjectOnSlide": function (name) {
                    if (proxies[name]) {
                        return true;
                    } else {
                        return name === "onslide";
                    }
                }
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.slideObjects.proxyAutoInstantiator", function () {
        expect(_extra.slideObjects.proxyAutoInstantiator).toBeDefined();
    });

    it("should allow us to send it a slide object name and make it create a proxy if none exists", function () {

        // setup
        _extra.slideObjects.getSlideObjectProxy("existing");
        _extra.slideObjects.getSlideObjectProxy.calls.reset();

        // run test
        expect(_extra.slideObjects.proxyAutoInstantiator.check("existing")).toBe(true);
        expect(_extra.slideObjects.getSlideObjectProxy).not.toHaveBeenCalled();

        expect(_extra.slideObjects.proxyAutoInstantiator.check("onslide")).toBe(true);
        expect(_extra.slideObjects.getSlideObjectProxy).toHaveBeenCalled();

    });

    it("should when we check a slide object, inform us whether it exists in the project", function () {

        expect(_extra.slideObjects.proxyAutoInstantiator.check("nonexisting")).toBe(false);

    });

    it("should allow us to register a model lookup method", function () {

        _extra.slideObjects.proxyAutoInstantiator.registerModelLookup(function (name) {
            return name === "valid";
        });

        expect(_extra.slideObjects.proxyAutoInstantiator.hasModelDataFor("invalid")).toBe(false);
        expect(_extra.slideObjects.proxyAutoInstantiator.hasModelDataFor("valid")).toBe(true);

    });

    it("should on entering slide, ensure proxies are created for slide objects with existing model data", function () {

        _extra.slideObjects.proxyAutoInstantiator.registerModelLookup(function (name) {
            return name === "valid";
        });

        _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback("*", "invalid");
        expect(_extra.slideObjects.getSlideObjectProxy).not.toHaveBeenCalled();

        _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback("*", "valid");
        expect(_extra.slideObjects.getSlideObjectProxy).toHaveBeenCalled();

    });
});