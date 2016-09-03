/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/11/15
 * Time: 11:10 AM
 * To change this template use File | Settings | File Templates.
 */
fdescribe("A test suite for _extra.hook", function () {

    "use strict";

    var module = unitTests.getModule("hookManager");

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "foo":jasmine.createSpy("_extra.foo"),
            "w":{
                "Object":Object
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.hook", function () {

        expect(_extra.addHook).toBeDefined();

    });

    it("should allow us to interrupt the call to a particular function in order to call our own", function () {

        var hook = jasmine.createSpy("hook");
        var raw = _extra.foo;
        _extra.addHook(_extra, "foo", hook);
        _extra.foo();
        expect(hook).toHaveBeenCalled();
        expect(raw).toHaveBeenCalled();

    });

    it("should allow us to remove a hook", function () {

        var hook = jasmine.createSpy("hook");
        var raw = _extra.foo;
        _extra.addHook(_extra, "foo", hook);
        expect(_extra.removeHook(_extra, "foo", hook)).toBe(true);
        _extra.foo();
        expect(hook).not.toHaveBeenCalled();
        expect(raw).toHaveBeenCalled();

        expect(_extra.removeHook(_extra, "bar", hook)).toBe(false);

    });

    it("should pass on the relevant arguments to the hook and the original", function () {

        var hook = jasmine.createSpy("hook");
        var raw = _extra.foo;
        _extra.addHook(_extra, "foo", hook);

        _extra.foo("Hello World");
        expect(hook).toHaveBeenCalledWith("Hello World");
        expect(raw).toHaveBeenCalledWith("Hello World");


        _extra.foo(1,2,3,4,5);
        expect(hook).toHaveBeenCalledWith(1,2,3,4,5);
        expect(raw).toHaveBeenCalledWith(1,2,3,4,5);

    });

    it("should allow us to chose if we want the hook to be called before or after the natural method", function () {

        var hook = jasmine.createSpy("hook").and.callFake(function () {
                    order.push("hook");
                }),
            raw = _extra.foo,
            order = [];

        raw.and.callFake(function() {
            order.push("raw");
        });

        // addHook()
        _extra.addHook(_extra, "foo", hook);
        _extra.foo();
        expect(order).toEqual(["raw","hook"]);

        // reset
        order = [];
        _extra.removeHook(_extra, "foo", hook);

        // addHookAfter()
        _extra.addHookAfter(_extra, "foo", hook);
        _extra.foo();
        expect(order).toEqual(["raw","hook"]);

        // reset
        order = [];
        _extra.removeHook(_extra, "foo", hook);

        // addHookBefore()
        _extra.addHookBefore(_extra, "foo", hook);
        _extra.foo();
        expect(order).toEqual(["hook","raw"]);

        // reset
        order = [];
        _extra.removeHook(_extra, "foo", hook);

        // Checking removeHook can also remove those 'before' hooks.
        _extra.foo();
        expect(order).toEqual(["raw"]);

    });

    it("should not call the original method, if the hook method returns something first", function () {

        var hook = jasmine.createSpy("hook").and.returnValue("hookValue"),
            raw = _extra.foo;

        // addHookBefore()
        _extra.addHookBefore(_extra, "foo", hook);
        _extra.foo();
        expect(_extra.foo()).toEqual("hookValue");
        expect(hook).toHaveBeenCalled();
        expect(raw).not.toHaveBeenCalled();

    });

    it("should allow us to edit the argument that will be sent to the original method", function () {

        var raw = _extra.foo;

        _extra.addHookBefore(_extra, "foo", function (parameter) {
            arguments[0] = "new";
            return arguments;
        });

        _extra.foo("old");

        expect(raw).toHaveBeenCalledWith("new");

    });

    it("should allow us to detect if a method already has a hook", function () {

        var spy = jasmine.createSpy("spy");

        _extra.addHook(_extra, "foo", spy);
        expect(_extra.hasHook(_extra, "foo")).toBe(true);
        _extra.removeHook(_extra, "foo", spy)
        expect(_extra.hasHook(_extra, "foo")).toBe(false);

    });

    it("should allow us to add a temporary hook which lasts a single method call", function () {

        var spy = jasmine.createSpy("spy");

        _extra.addOneTimeHook(_extra, "foo", spy);

        _extra.foo();
        expect(spy).toHaveBeenCalled();

        spy.calls.reset();

        _extra.foo();
        expect(spy).not.toHaveBeenCalled();

    });

    it("should call multiple hooks if we add them to the same object", function () {

        var order = [];

        var firstSpy = jasmine.createSpy("firstSpy").and.callFake(function () {
                order.push(firstSpy);
            }),
            secondSpy = jasmine.createSpy("secondSpy").and.callFake(function () {
                order.push(secondSpy);
            });

        _extra.addOneTimeHook(_extra, "foo", firstSpy);
        _extra.addOneTimeHook(_extra, "foo", secondSpy);

        _extra.foo();

        expect(order).toEqual([firstSpy, secondSpy]);

    });
});