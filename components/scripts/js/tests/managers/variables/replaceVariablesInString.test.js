/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 25/04/17
 * Time: 2:40 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for variableManager.replaceVariablesInString", function () {

    "use strict";

    var module = unitTests.getModule("replaceVariablesInString");

    beforeEach(function () {

        var variables = {
            "foo":"foo",
            "bar":"bar",
            "foobar":"foobar"
        };

        window._extra = {
            "classes":unitTests.classes,
            "variableManager": {
                "hasVariable":function(variableName) {
                    return variables.hasOwnProperty(variableName);
                },
                "getVariableValue": function (variableName) {
                    return variables[variableName];
                }
            },
            "w":{
                "Object":Object
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the variableManager.replaceVariablesInString method", function () {
        expect(_extra.variableManager.replaceVariablesInString).toBeDefined();
    });

    it("should replace variable names in URL string", function () {
        var result = _extra.variableManager.replaceVariablesInString("woo-$$foobar$$-hoo");
        expect(result).toBe("woo-foobar-hoo");
    });

    it("should not replace non-existant variables", function () {
        var result = _extra.variableManager.replaceVariablesInString("woo-$$invalid$$-hoo");
        expect(result).toBe("woo-$$invalid$$-hoo");
    });

    it("should replace multiple variables in URL string", function () {
        var result = _extra.variableManager.replaceVariablesInString("woo-$$foobar$$-hoo-$$foo$$-ray-$$bar$$");
        expect(result).toBe("woo-foobar-hoo-foo-ray-bar");
    });

});