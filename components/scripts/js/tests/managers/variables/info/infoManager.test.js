/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 22/12/15
 * Time: 4:10 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.infoManager", function () {

    "use strict";

    var module = unitTests.getModule("infoVariableManager"),
        variables = {};

    beforeEach(function () {

        var changeCallback = new unitTests.classes.Callback(),
            readCallback = new unitTests.classes.Callback();

        window._extra = {
            "classes":unitTests.classes,
            "variableManager":{
                "getVariableValue":function(variableName) {
                    var result = readCallback.sendToCallback(variableName, {
                        "variableName":variableName
                    });

                    if (result) {
                        return result;
                    }

                    return variables[variableName];
                },
                "setVariableValue":function(variableName, value) {
                    variables[variableName] = value;
                    // TODO: This needs to be changed to work with storyline.
                    changeCallback.sendToCallback(variableName, {
                        "variableName":variableName,
                        "newValue": value
                    });
                },
                "hasVariable":function (variableName) {
                    return variables.hasOwnProperty(variableName);
                },
                "listenForVariableChange":function(variableName, method) {
                    changeCallback.addCallback(variableName, method);
                },
                "listenForVariableRead": function(variableName, method) {
                    readCallback.addCallback(variableName, method);
                }
            }
        };

        this.onLoadCallback = module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should create the _extra.infoManager object", function () {
        expect(_extra.infoManager).toBeDefined();
    });

    it("should inform us of whether this variable exists", function () {

        variables = {
            "xinfoTest":"test"
        };

        var info = {
            "suffix":"invalid"
        };
        expect(_extra.infoManager.registerInfoVariable(info)).toBe(false);

        info.suffix = "Test";
        expect(_extra.infoManager.registerInfoVariable(info)).toBe(true);

    });

    it("should call getter and setter methods", function () {

        variables = {
            "xinfoTest":"test"
        };

        var info = {
            "suffix":"Test",
            "getter":jasmine.createSpy("getter").and.returnValue("return"),
            "setter":jasmine.createSpy("setter")
        };

        expect(_extra.infoManager.registerInfoVariable(info)).toBe(true);

        this.onLoadCallback();
        _extra.variableManager.setVariableValue("xinfoTest", "foo");
        expect(info.setter).toHaveBeenCalledWith("foo");
        expect(info.getter).not.toHaveBeenCalled();

        expect(_extra.variableManager.getVariableValue("xinfoTest")).toBe("return");
        expect(info.getter).toHaveBeenCalled();

    });

    it("should detect the existance of a valid variable with an underscore at the front of its name", function () {

        variables = {
            "_xinfoTest":"test"
        };

        var info = {
            "suffix":"Test",
            "getter":jasmine.createSpy("getter").and.returnValue("return"),
            "setter":jasmine.createSpy("setter")
        };

        expect(_extra.infoManager.registerInfoVariable(info)).toBe(true);
        expect(info.name).toBe("_xinfoTest");

    });
});