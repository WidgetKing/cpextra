/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/10/15
 * Time: 4:12 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A suite to test _extra.eventManager", function () {

    "use strict";

    var module = unitTests.getModule("eventManager");

    beforeEach(function () {
        window._extra = {
            "w":{
                "document":{
                    "documentElement":{

                    }
                },
                "Object":Object
            },
            /*"variableManager":{
                "hasVariable":function (variableName) {
                    if (variableName === "xcmnd")
                }
            },*/
            "classes":unitTests.classes,
            "slideObjects":{
                "proxyAutoInstantiator":{
                    "registerModelLookup":jasmine.createSpy("_extra.slideObjects.proxyAutoInstantiator.registerModelLookup"),
                    "check":jasmine.createSpy("_extra.slideObjects.proxyAutoInstantiator.check")
                }
            },
            "createEvent": function (name) {
                return new unitTests.classes.CustomEvent(name);
            }
        };
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("Should define the _extra.eventManager object", function () {
        expect(_extra.eventManager).toBeDefined();
        expect(_extra.eventManager.eventDispatcher).toBeDefined();
        expect(_extra.slideObjects.proxyAutoInstantiator.registerModelLookup).toHaveBeenCalled();
    });

    it("should allow us to send the name of the object that is enacting the current event", function () {

        _extra.eventManager.setEventTarget("MyTarget");
        expect(_extra.eventManager.lastEventTarget).toBe("MyTarget");

    });

    it("should allow us to add event listeners event dispatching and calling of listeners", function () {
        var a = {
            "dummy": function () {}
        };

        spyOn(a,"dummy");

        _extra.eventManager.eventDispatcher.addEventListener("foobar", a.dummy);

        var e = _extra.createEvent("foobar");
        _extra.eventManager.eventDispatcher.dispatchEvent(e);

        expect(a.dummy).toHaveBeenCalled();
    });

    it("should allow us to access an event mediator", function () {
        var mediator = _extra.eventManager.getEventMediator("foobar");
        expect(_extra.eventManager.getEventMediator("foobar")).toBe(mediator);
    });

    it("should inform us if we have an event mediator for a particular slide object", function () {

        _extra.eventManager.getEventMediator("foobar");
        expect(_extra.eventManager.hasEventMediatorFor("foobar")).toBe(true);
        expect(_extra.eventManager.hasEventMediatorFor("invalid")).toBe(false);

    });

    it("should unload an event mediator if it has no event listeners", function () {
        var mediator = _extra.eventManager.getEventMediator("foobar");
        mediator.addEventListener("click", "button", "criteria");
        mediator.removeEventListener("click", "button", "criteria");
        expect(_extra.eventManager.hasEventMediatorFor("foobar")).toBe(false);
    });


    it("should create a slide object proxy if no proxy exists for the event mediator", function () {

        _extra.eventManager.getEventMediator("foobar");
        expect(_extra.slideObjects.proxyAutoInstantiator.check).toHaveBeenCalledWith("foobar");

    });

    it("should allow us to add and remove event listeners via the addEventListener and removeEventListener methods", function () {

        _extra.eventManager.addEventListener("foobar", "click", "button", "criteria");
        var mediator = _extra.eventManager.getEventMediator("foobar");
        expect(mediator.hasEventListener("click", "button", "criteria")).toBe(true);

        _extra.eventManager.removeEventListener("foobar", "click", "button", "criteria");
        expect(mediator.hasEventListener("click", "button", "criteria")).toBe(false);

    });

});