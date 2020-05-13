/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 9:40 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    function performCommandVariablesTest(software, getMockObject) {

        describe("A test suite for command variables in " + software, function () {

            var module = unitTests.getModule("commandVariableManager"),
                whiteSpaceManager = unitTests.getModule("whiteSpaceManager");

            beforeEach(function () {
                window._extra = getMockObject();
                _extra.classes = unitTests.classes;
                spyOn(_extra.slideObjects, "hide").and.callThrough();
                whiteSpaceManager();
                this.onLoadCallback = module();
            });

            afterEach(function () {
                delete window._extra;
            });

            it("should allow us to register our own command variable", function () {
                spyOn(_extra.variableManager,"hasVariable").and.callThrough();

                _extra.variableManager.registerCommandVariable("MyVariable", function () {});
                this.onLoadCallback();
                expect(_extra.variableManager.hasVariable).toHaveBeenCalledWith("xcmndMyVariable");
            });

            it("should detect if relevant variables exist", function () {
                spyOn(_extra.variableManager,"hasVariable").and.callThrough();
                _extra.variableManager.registerCommandVariable("Hide", function () {});
                _extra.variableManager.registerCommandVariable("Enable", function () {});
                this.onLoadCallback();

                expect(_extra.variableManager.hasVariable).toHaveBeenCalledWith("xcmndHide");
                expect(_extra.variableManager.hasVariable).toHaveBeenCalledWith("_xcmndHide");
                expect(_extra.variableManager.hasVariable).toHaveBeenCalledWith("_xcmndEnable");
            });

            it("should pass the parameters set in the variable along to an internal function", function () {

                var dummy = jasmine.createSpy("hide calllback");

                _extra.variableManager.registerCommandVariable("Hide",dummy);

                this.onLoadCallback();

                _extra.variableManager.setVariableValue("xcmndHide","foobar");
                expect(dummy).toHaveBeenCalledWith("foobar");
                _extra.variableManager.setVariableValue("xcmndHide","foo, bar");
                expect(dummy).toHaveBeenCalledWith("foo");
                expect(dummy).toHaveBeenCalledWith("bar");
                expect(_extra.variableManager.getVariableValue("xcmndHide")).toBe("");
            });

            it("should not react to '' being passed into the command variables", function () {

                var dummy = jasmine.createSpy("hide calllback");

                _extra.variableManager.registerCommandVariable("Hide",dummy);

                this.onLoadCallback();
                _extra.variableManager.setVariableValue("xcmndHide","");
                expect(_extra.slideObjects.hide).not.toHaveBeenCalled();
            });

            it("should strip out spaces from set value", function () {

                var dummy = jasmine.createSpy("hide calllback");

                _extra.variableManager.registerCommandVariable("Hide",dummy);

                this.onLoadCallback();

                _extra.variableManager.setVariableValue("xcmndHide","foo bar");
                expect(dummy).toHaveBeenCalledWith("foobar");

            });

            it("should not strip out spaces from anything surrounded by double braces: []", function () {

                var dummy = jasmine.createSpy("hide calllback");

                _extra.variableManager.registerCommandVariable("Hide",dummy);

                this.onLoadCallback();

                _extra.variableManager.setVariableValue("xcmndHide",'[foo bar]');
                expect(dummy).toHaveBeenCalledWith('[foo bar]');

            });

            it("should not split on commas ',' inside of double braces: []", function () {

                var dummy = jasmine.createSpy("hide calllback");

                _extra.variableManager.registerCommandVariable("Hide",dummy);

                this.onLoadCallback();

                _extra.variableManager.setVariableValue("xcmndHide",'[foo, bar], hello');
                expect(dummy).toHaveBeenCalledWith('[foo, bar]');
                expect(dummy).toHaveBeenCalledWith("hello");

            });

            it("should be able to handle the bug where Captivate assigns a div to a variable", function () {

                // When you assign a captivate variable the name of a slide object, it assigns the variable
                // with that slide object's div, rather than just the string.
                // This can be a major headache sometimes.

                var dummy = jasmine.createSpy("hide calllback");

                _extra.variableManager.registerCommandVariable("Hide",dummy);

                this.onLoadCallback();

                _extra.variableManager.setVariableValue("xcmndHide", {
                    id:"slideobject"
                });
                expect(dummy).toHaveBeenCalledWith("slideobject");

                // If just a non-div object is passed in, then we won't notify CpExtra
                dummy.calls.reset();
                _extra.variableManager.setVariableValue("xcmndHide", {});
                expect(dummy).not.toHaveBeenCalled();

            });

            it("should allow us to change the methods by which parameters are handled", function () {

                var hideSpy = jasmine.createSpy("hide calllback"),
                    showSpy = jasmine.createSpy("show calllback");

                // Setup variables
                _extra.variableManager.registerCommandVariable("Hide",hideSpy,
                        _extra.variableManager.parameterHandlers.executeOncePerParameter);

                _extra.variableManager.registerCommandVariable("Show", showSpy,
                        _extra.variableManager.parameterHandlers.sendParametersAsParameters);

                this.onLoadCallback();

                _extra.variableManager.setVariableValue("xcmndHide", "foo, bar");
                expect(hideSpy).toHaveBeenCalledWith("foo");
                expect(hideSpy).toHaveBeenCalledWith("bar");

                _extra.variableManager.setVariableValue("xcmndShow", "foo, bar");
                expect(showSpy).toHaveBeenCalledWith("foo", "bar");

            });

        });


    }

    performCommandVariablesTest(unitTests.CAPTIVATE, function () {

        var variables = {
            "xcmndHide":0,
            "xcmndShow":"My_Text_Box",
            "_xcmndEnable":0,
            "xcmndReset":0,
            "_xcmndReset":0
        };

        var callbacks = {};

        return {
            "variableManager":{
                "hasVariable":function (name) {
                    return variables.hasOwnProperty(name);
                },
                "getVariableValue": function (variableName) {
                    return variables[variableName];
                },
                "setVariableValue": function (variableName, value) {
                    variables[variableName] = value;
                    if (callbacks[variableName]) {
                        callbacks[variableName]();
                    }
                },
                "listenForVariableChange": function (variableName, callback) {
                    callbacks[variableName] = callback;
                    //_extra.captivate.eventDispatcher.addEventListener("CPAPI_VARIABLEVALUECHANGED",callback,variableName);
                },
                "stopListeningForVariableChange": function(variableName, callback) {
                    //_extra.captivate.eventDispatcher.removeEventListener("CPAPI_VARIABLEVALUECHANGED",callback,variableName);
                },
                "internalListenForVariableChange":function () {

                },
                "internalStopListeningForVariableChange":function() {

                }
            },
            "slideObjects":{
                "hide":function () {},
                "show":function () {},
                "enable":function () {},
                "disable":function () {},
                "enableForMouse":function () {},
                "disableForMouse":function () {},
                "states":{
                    "change":function () {}
                }
            },
            "animationManager":{
                "matchEntryToEffect":function () {}
            },
            "debugging":{
                "debug": jasmine.createSpy()
            }
        };
    });

}());
