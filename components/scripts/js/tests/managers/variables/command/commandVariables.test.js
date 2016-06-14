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

            var module = unitTests.getModule("commandVariableManager");

            beforeEach(function () {
                window._extra = getMockObject();
                spyOn(_extra.slideObjects, "hide").and.callThrough();
                this.onLoadCallback = module();
            });

            afterEach(function () {
                delete window._extra;
            });

            it("should allow us to register our own command variable", function () {
                spyOn(_extra.variableManager,"hasVariable").and.callThrough();

                _extra.variableManager.registerCommandVariable("MyVariable",function () {});
                this.onLoadCallback();
                expect(_extra.variableManager.hasVariable).toHaveBeenCalledWith("xcmndMyVariable");
            });

            it("should detect if relevant variables exist", function () {
                spyOn(_extra.variableManager,"hasVariable").and.callThrough();
                _extra.variableManager.registerCommandVariable("Hide",function () {});
                _extra.variableManager.registerCommandVariable("Enable",function () {});
                this.onLoadCallback();
                expect(_extra.variableManager.hasVariable).toHaveBeenCalledWith("xcmndHide");
                expect(_extra.variableManager.hasVariable).not.toHaveBeenCalledWith("_xcmndHide");
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
                this.onLoadCallback();
                _extra.variableManager.setVariableValue("xcmndHide","");
                expect(_extra.slideObjects.hide).not.toHaveBeenCalled();
            });

        });


    }

    performCommandVariablesTest(unitTests.CAPTIVATE, function () {

        var variables = {
            "xcmndHide":0,
            "xcmndShow":"My_Text_Box",
            "_xcmndEnable":0
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
            }
        };
    });

}());