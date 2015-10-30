/*global initExtra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 25/09/15
 * Time: 8:25 PM
 * To change this template use File | Settings | File Templates.
 */

(function () {

    "use strict";

    describe("Test suit for main.js general setup", function() {

        /*beforeEach(function () {
            window = {"test":2};
            initExtra();
        });*/
        afterEach(function () {
            delete window._extra;
        });

        it("should define the _extra internal variable", function () {
            initExtra();
            expect(_extra).toBeDefined();
        });

        it("should define the _extra.X public API", function () {
            initExtra();
            expect(_extra.X).toBeDefined();
        });

        it("should define logging methods", function () {
            initExtra();
            expect(_extra.log).toBeDefined();
            expect(_extra.error).toBeDefined();
        });

        it("should not define _extra if it has already been defined", function () {
            window._extra = "Test";
            initExtra();
            expect(window._extra).toBe("Test");
        });

        it("should locate the highest object window on the page", function () {
            var mockWindow = {
                "parent":window,
                "top":window
            };
            initExtra(mockWindow);
            expect(_extra.w).toBe(window);
        });

        it("should abort if the global variable 'X' has already been defined", function () {
            window.top.X = true;
            initExtra();
            expect(_extra.aborted).toBe(true);
            delete window.top.X;
        });

        it("should not instantiate any modules if Extra has been aborted", function () {
            window.top.X = true;
            initExtra();

            this.dummy = function () {};
            spyOn(this,"dummy");

            _extra.registerModule("foo",this.dummy);
            expect(this.dummy).not.toHaveBeenCalled();

            delete window.top.X;
        });

        it("should define some constants which are used to identify Captivate and Storyline", function () {
            initExtra();
            expect(_extra.CAPTIVATE).toBeDefined();
            expect(_extra.STORYLINE).toBeDefined();
        });

        it("should get a reference to the jQuery library", function () {
            window.top.$ = "foobar";

            initExtra();
            expect(_extra.$).toBe("foobar");

            delete window.$;
        });

    });

    describe("Test Suite for main.js module registering", function () {

        var dummy = function () {};
        var a = {};

        beforeEach(function () {
            initExtra();
            a.dummy = dummy;
            spyOn(a, "dummy");
        });

        afterEach(function () {
            delete window._extra;
        });

        it("should immediately call the constructor for a module that has no dependencies", function () {

            _extra.registerModule("moduleName", a.dummy);

            expect(a.dummy).toHaveBeenCalled();
        });

        it("should throw an exception if we pass in a module that depends on itself", function () {
            expect(function () {
                        _extra.registerModule("foo","foo",dummy);
                    }).toThrow();
        });

        it("should instantly be initialized if all its dependencies are initialized", function (){


            _extra.registerModule("foo", dummy);
            _extra.registerModule("bar", ["foo"], a.dummy);
            expect(a.dummy).toHaveBeenCalled();

        });

        it("should wait for all its dependencies to be initialized before being initialized itself", function () {
            _extra.registerModule("foo", ["bar","sheep"], a.dummy);
            _extra.registerModule("bar",[],dummy);
            _extra.registerModule("sheep",[],dummy);
            expect(a.dummy).toHaveBeenCalled();
        });

        it("should chain initializing dependencies", function () {
            _extra.registerModule("foo", "bar", a.dummy);
            _extra.registerModule("bar", "sheep", dummy);
            _extra.registerModule("sheep", dummy);
            expect(a.dummy).toHaveBeenCalled();
        });

        it("should prevent modules from being initialized twice, if two of their dependencies are instantiated at the same time", function () {
            var i = 0;
            var testFunction = function() {
                i+=1;
            };
            _extra.registerModule("bar",["foo"],dummy);
            _extra.registerModule("main",["foo","bar"],testFunction);
            _extra.registerModule("foo",dummy);
            expect(i).toEqual(1);
        });

        it("should alert us if two modules try to reigster the same name (possible Captivate Storyline conflict)", function () {
            _extra.registerModule("foo", dummy);
            expect(function () {
                _extra.registerModule("foo", dummy);
            }).toThrow();
        });

        it("should not call a module constructor whose dependencies have not been instantiated", function () {
            _extra.registerModule("foo","bar",a.dummy);
            expect(a.dummy).not.toHaveBeenCalled();
        });


        it("should note call module's onload callback when the Widget's Initialize function is called in Storyline", function () {
            _extra.registerModule("foo", function () {
                return a.dummy;
            });

            window.CaptivateExtraWidgetInit();
            expect(a.dummy).not.toHaveBeenCalled();
        });

        it("should call module's onload callback when the Widget's Initialize function is called", function () {
            _extra.registerModule("foo", function () {
                return a.dummy;
            });

            window.top.cp = true;
            window.CaptivateExtraWidgetInit();
            expect(a.dummy).toHaveBeenCalled();
            delete window.top.cp;
        });

        // Have not found a way to make this test work
        xit("should not call module's onload callback from the 'load' event listener, if not in Storyline", function () {
            _extra.registerModule("foo",function () {
                return a.dummy;
            });

            var loadEvent = document.createEvent("HTMLEvents");
            loadEvent.initEvent("load", true, true);
            window.document.dispatchEvent(loadEvent);
            expect(a.dummy).toHaveBeenCalled();
        });

        it("should be able to disregard software identifiers if passed in for unit testing sakes", function () {
            _extra.registerModule("foo", a.dummy, "cp");
            expect(a.dummy).toHaveBeenCalled();
        });

    });

    describe("Test suite for main.js class repository and handling", function () {

        beforeEach(function () {
           initExtra();
        });

        afterEach(function () {
            delete window._extra;
        });

        it("should be able to register and access a class", function () {
            var classConstructor = function () {};
            _extra.registerClass("MyClass", classConstructor);
            expect(_extra.classes.MyClass).toBe(classConstructor);
        });

        it("should be able to handle inheritence of classes", function () {
            var superClass = function () {};
            superClass.prototype.prop1 = true;
            var childClass = function () {};
            superClass.prototype.prop2 = true;

            _extra.registerClass("ChildClass", childClass, superClass);

            var instance = new _extra.classes.ChildClass();
            expect(instance.prop1).toBe(true);
            expect(instance.prop2).toBe(true);
        });

        it("should not try to find '" + unitTests.CAPTIVATE + "' or '" + unitTests.STORYLINE + "' as super classes", function () {
            function SuperClass() {

            }
            SuperClass.prototype.property = "foobar";
            _extra.registerClass(unitTests.CAPTIVATE, SuperClass);
            _extra.registerClass(unitTests.STORYLINE, SuperClass);

            _extra.registerClass("ChildClassCaptivate", function(){}, unitTests.CAPTIVATE);
            _extra.registerClass("ChildClassStoryline", function(){}, unitTests.STORYLINE);

            var instance = new _extra.classes.ChildClassCaptivate();
            expect(instance.property).not.toBeDefined();
            instance = new _extra.classes.ChildClassStoryline();
            expect(instance.property).not.toBeDefined();


        });

        it("should be able to define super class through string", function () {
            var superClass = function () {};
            superClass.prototype.prop1 = true;
            var childClass = function () {};
            superClass.prototype.prop2 = true;

            _extra.registerClass("SuperClass", superClass);
            _extra.registerClass("ChildClass", childClass, "SuperClass");

            var instance = new _extra.classes.ChildClass();
            expect(instance.prop1).toBe(true);
            expect(instance.prop2).toBe(true);
        });

        it("should throw and error if we try to make a class inherit from a super class that doesn't exist", function () {
            expect(function () {
                _extra.registerClass("ChildClass", function () {}, "SuperClass");
            }).toThrow();
        });

    });

}());
