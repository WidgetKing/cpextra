/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/10/15
 * Time: 5:06 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.preferenceManager", function () {

    "use strict";

    var module = unitTests.getModule("preferenceManager");
    var variables = {
        "xprefallowed":1,
        "xprefdisallowed":0,
        "_xprefunderscore":1
    };
    var dummyObject = {
        "enable": function () {},
        "disable": function () {}
    };

    beforeEach(function () {

        spyOn(dummyObject,"enable");
        spyOn(dummyObject,"disable");

        window._extra = {
            "variableManager":{
                "getVariableValue":function (varName) {
                    return variables[varName];
                },
                "hasVariable": function (varName) {
                    return variables[varName] !== undefined;
                },
                "listenForVariableChange": function (varName, callback) {

                },
                "parse":{
                    "boolean": function(value) {
                        return value >= 1;
                    }
                }
            }
        };
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define a behaviour manager", function () {
        expect(_extra.preferenceManager).toBeDefined();
    });

    it("should define a preferences object", function () {
        expect(_extra.preferences).toBeDefined();
    });

    it("should register behaviour modules, calling their enable function instantly " +
            "if a variable is defined to enable the functionality enabled", function () {
        _extra.preferenceManager.registerPreferenceModule("allowed", dummyObject);
        expect(dummyObject.enable).toHaveBeenCalled();
    });

    it("should prevent you from registering two modules of the same type", function () {
        expect(function () {
            _extra.preferenceManager.registerPreferenceModule("allowed", dummyObject);
            _extra.preferenceManager.registerPreferenceModule("allowed", dummyObject);
        }).toThrow();
    });

    it("should throw an error if we do not give it an enable or disable function", function () {
        // No enable
        expect(function () {
            _extra.preferenceManager.registerPreferenceModule("allowed",{"disable":function () {}});
        }).toThrow();

        // No disable
        expect(function () {
            _extra.preferenceManager.registerPreferenceModule("allowed",{"enable":function () {}});
        }).toThrow();
    });

    it("should return false if no variable has been defined to control the behaviour, " +
            "BUT not if there is a variable and it has been set to false", function () {
        expect(_extra.preferenceManager.registerPreferenceModule("noVariable",dummyObject)).toBe(false);
        expect(_extra.preferenceManager.registerPreferenceModule("disallowed",dummyObject)).toBe(true);
    });

    it("should identify a variable with an underscore at the start of its name as still being a valid behaviour variable", function () {
        expect(_extra.preferenceManager.registerPreferenceModule("underscore",dummyObject)).toBe(true);
    });

    it("should wait until a predetermined variable has been set to true before instantiating", function () {

        var callback;

        // Get the back end function which tells the preference manager whether or not the variable has changed.
        spyOn(_extra.variableManager, "listenForVariableChange").and.callFake(function (variableName,changeCallback) {
            callback = changeCallback;
        });

        _extra.preferenceManager.registerPreferenceModule("disallowed",dummyObject);
        expect(callback).not.toBeNull();
        variables.xprefdisallowed = 1;
        callback();
        expect(dummyObject.enable).toHaveBeenCalled();
        expect(dummyObject.disable).not.toHaveBeenCalled();
        variables.xprefdisallowed = 0;
        callback();
        expect(dummyObject.disable).toHaveBeenCalled();
    });

    it("should pass the variable's value into the enable function", function () {

        _extra.preferenceManager.registerPreferenceModule("allowed",dummyObject);
        expect(dummyObject.enable).toHaveBeenCalledWith(1);

    });

    it("should update us when the variable value is changed, even if it doesn't swap us between enabling and disabling", function () {

        var callback;

        // Get the back end function which tells the preference manager whether or not the variable has changed.
        spyOn(_extra.variableManager, "listenForVariableChange").and.callFake(function (variableName,changeCallback) {
            callback = changeCallback;
        });

        dummyObject.update = jasmine.createSpy("update");

        _extra.preferenceManager.registerPreferenceModule("disallowed",dummyObject);
        expect(callback).not.toBeNull();
        variables.xprefdisallowed = 1;
        callback();
        expect(dummyObject.enable).toHaveBeenCalled();
        expect(dummyObject.update).toHaveBeenCalledWith(1);
        expect(dummyObject.disable).not.toHaveBeenCalled();

        variables.xprefdisallowed = 2;
        callback();
        expect(dummyObject.update).toHaveBeenCalledWith(2);

    });


});
