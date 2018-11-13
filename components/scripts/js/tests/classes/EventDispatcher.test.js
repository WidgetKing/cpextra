/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/11/15
 * Time: 7:40 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the EventDispatcher class", function () {

    "use strict";


    beforeEach(function () {

        window._extra = {
            "error":jasmine.createSpy("_extra.error"),
            "w":{
                "Object":Object
            }
        };

        // h stands for 'handler'
        this.h = jasmine.createSpy("Event Handler");
        this.eventDispatcher = new unitTests.classes.EventDispatcher();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should allow us to add event listeners and check they exist", function () {

        this.eventDispatcher.addEventListener("event", this.h);
        expect(this.eventDispatcher.hasEventListener("event")).toBe(true);

    });

    it("should throw an error if we try to pass something other as a function as a handler", function () {

        this.eventDispatcher.addEventListener("event", 6);

        expect(_extra.error).toHaveBeenCalled();

    });

    it("should be able to tell us if an event listener exists to call a certain function", function () {

        var notAHandler = function () {

        };

        this.eventDispatcher.addEventListener("event", this.h);
        expect(this.eventDispatcher.hasEventListener("event", notAHandler)).toBe(false);
        expect(this.eventDispatcher.hasEventListener("event", this.h)).toBe(true);

    });

    it("should allow us to dispatch events", function () {

        var event = new unitTests.classes.CustomEvent("event");
        this.eventDispatcher.addEventListener("event", this.h);
        this.eventDispatcher.dispatchEvent(event);
        expect(this.h).toHaveBeenCalledWith(event);

    });

    it("should allow us to remove event listeners", function () {

        var h2 = jasmine.createSpy("Event Handler 2");

        var event = new unitTests.classes.CustomEvent("event");
        this.eventDispatcher.addEventListener("event", this.h);
        this.eventDispatcher.addEventListener("event", h2);
        this.eventDispatcher.removeEventListener("event", h2);
        this.eventDispatcher.dispatchEvent(event);
        expect(this.h).toHaveBeenCalledWith(event);
        expect(h2).not.toHaveBeenCalled();

    });

    it("should allow us to detect if there are any events listening for a particular type", function () {

        this.eventDispatcher.addEventListener("event", this.h);
        expect(this.eventDispatcher.hasListenerFor("event")).toBe(true);

        this.eventDispatcher.removeEventListener("event", this.h);
        expect(this.eventDispatcher.hasListenerFor("event")).toBe(false);

    });
});