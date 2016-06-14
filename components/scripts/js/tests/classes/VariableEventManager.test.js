/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/03/16
 * Time: 10:48 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the VariableEventManager class", function () {

    "use strict";

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes
        };

        this.data = {};
        this.addListener = jasmine.createSpy("addListener").and.callFake(function (variableName, callback) {

        });
        this.removeListener = jasmine.createSpy("removeListener");
        this.variableEventManager = new unitTests.classes.VariableEventManager(this.addListener, this.removeListener);
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should allow us to add an event listener", function () {

        var callback = jasmine.createSpy("callback");
        this.variableEventManager.addListener("MyVar", callback);
        expect(this.addListener).toHaveBeenCalledWith("MyVar", jasmine.any(Function));

    });

    it("should be able to tell us if a specific event is already registered", function () {

        var callback = jasmine.createSpy("callback");
        expect(this.variableEventManager.hasListener("MyVar", callback)).toBe(false);

        this.variableEventManager.addListener("MyVar", callback);
        expect(this.variableEventManager.hasListener("MyVar", callback)).toBe(true);

    });

    it("should not add multiple listeners of the same type", function () {

        var callback = jasmine.createSpy("callback");
        this.variableEventManager.addListener("MyVar", callback);
        expect(this.addListener).toHaveBeenCalledWith("MyVar", jasmine.any(Function));
        this.addListener.calls.reset();

        this.variableEventManager.addListener("MyVar", callback);
        expect(this.addListener).not.toHaveBeenCalled();

    });

    it("should be able to remove listeners", function () {

        var callback = jasmine.createSpy("callback"),
            callbackWrapper;
        this.variableEventManager.addListener("MyVar", callback);
        callbackWrapper = this.addListener.calls.argsFor(0)[1];
        expect(callbackWrapper).not.toEqual(callback);

        this.variableEventManager.removeListener("MyVar", callback);
        expect(this.removeListener).toHaveBeenCalledWith("MyVar", callbackWrapper);
        expect(this.variableEventManager.hasListener("MyVar", callback)).toBe(false);

    });

    it("should wrap the callback in a function to return us accurate event data", function () {

        var callback = jasmine.createSpy("callback"),
            callbackWrapper;
        this.variableEventManager.addListener("MyVar", callback);
        callbackWrapper = this.addListener.calls.argsFor(0)[1];

        callbackWrapper();
        expect(callback).toHaveBeenCalledWith(jasmine.any(_extra.classes.VariableEventProxy));

    });
});