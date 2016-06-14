/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 7:57 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.variableManager.parser", function () {

    "use strict";

    var module = unitTests.getModule("parameterParser"),
        queryEngine = unitTests.getModule("queryManager");

    beforeEach(function () {

        var slideObjects = {
            "slideObject":true
        };

        var variables = {
            "variable":"value",
            "variable_so":"slideObject ",
            "variable_n":11,
            "variable_q":"slideOb@",
            "variable_invalid":"invalid",
            "variable_custom":"custom"
        };

        window._extra = {
            "variableManager":{
                "hasVariable":function (name) {
                    return variables.hasOwnProperty(name);
                },
                "getVariableValue":function (name) {
                    return variables[name];
                }
            },
            "slideObjects":{
                "WILDCARD_CHARACTER":"@",
                "hasSlideObjectInProject":function (name) {
                    return slideObjects.hasOwnProperty(name);
                }
            },
            "w":{
                "parseFloat":parseFloat,
                "parseInt":parseInt,
                "isNaN":isNaN
            },
            "parseInt":parseInt
        };

        queryEngine();
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.variableManager.parser object", function () {
        expect(_extra.variableManager.parse).toBeDefined();
    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// _extra.variableManager.parse.string
    ///////////////////////////////////////////////////////////////////////
    it("should give us readable data even if we give it nothing", function () {

        expect(_extra.variableManager.parse.string(undefined)).toEqual(jasmine.objectContaining({
            "isVariable":false,
            "isSlideObject":false,
            "isQuery":false,
            "isBlank":true,
            "value":undefined
        }));

    });

    it("should be able to tell us if this is a slide object", function () {

        expect(_extra.variableManager.parse.string("slideObject").isSlideObject).toEqual(true);
        expect(_extra.variableManager.parse.string("variable").isSlideObject).toEqual(false);

    });

    it("should be able to tell us if this is a variable", function () {

        expect(_extra.variableManager.parse.string("variable").isVariable).toEqual(true);
        expect(_extra.variableManager.parse.string("slideObject").isVariable).toEqual(false);

    });

    it("should not give us the details of a variable if we order it not to recurse", function () {

        expect(_extra.variableManager.parse.string("variable").variable).toBeDefined();
        expect(_extra.variableManager.parse.string("variable", null, true).variable).not.toBeDefined();

    });

    it("should be able to tell us if this is a number", function () {

        expect(_extra.variableManager.parse.string(1.1).isNumber).toEqual(true);
        expect(_extra.variableManager.parse.string("1.1").isNumber).toEqual(true);
        expect(_extra.variableManager.parse.string("slideObject").isNumber).toEqual(false);

    });

    it("should be able to tell us the type of the variable's value", function () {

        var result = _extra.variableManager.parse.string("variable_so");

        expect(result).toEqual(jasmine.objectContaining({
            "isVariable":true,
            "isSlideObject":false,
            "isQuery":false,
            "isNumber": false,
            "isBlank": false,
            "value":"variable_so"
        }));
        expect(result.variable).toEqual(jasmine.objectContaining({
            "isSlideObject":true,
            "isQuery": false,
            "isNumber": false,
            "isVariable": false,
            "isBlank": false,
            "value":"slideObject"
        }));

        result = _extra.variableManager.parse.string("variable_n");

        expect(result).toEqual(jasmine.objectContaining({
            "isVariable":true,
            "isSlideObject":false,
            "isQuery":false,
            "value":"variable_n"
        }));

        expect(result.variable).toEqual(jasmine.objectContaining({
            "isSlideObject":false,
            "isNumber": true,
            "value": 11
       }));
    });

    it("should be able to tell us if the value is @ syntax related", function () {

        var result = _extra.variableManager.parse.string("slideOb@");

        expect(result).toEqual(jasmine.objectContaining({
            "isVariable":false,
            "isSlideObject":false,
            "isQuery":true,
            "value":"slideOb@"
        }));

        result = _extra.variableManager.parse.string("variable_q");

        expect(result).toEqual(jasmine.objectContaining({
            "isVariable":true,
            "isSlideObject":false,
            "isQuery":false,
            "value":"variable_q"
        }));

        expect(result.variable).toEqual(jasmine.objectContaining({
            "isSlideObject":false,
            "isNumber":false,
            "isQuery":true,
            "value":"slideOb@"
        }));
    });

    it("should allow us to pass in a custom type and evaluate that", function () {
        var customType = jasmine.createSpy("customType").and.callFake(function (string, data) {

            if (string === "custom") {
                data.test = "hello";
                return true;
            } else {
                return false;
            }

        });

        expect(_extra.variableManager.parse.string("invalid", customType)).toEqual(jasmine.objectContaining({
            "isVariable":false,
            "isSlideObject":false,
            "isQuery":false,
            "isCustomType":false,
            "value":"invalid"
        }));

        expect(customType).toHaveBeenCalled();

        expect(_extra.variableManager.parse.string("custom", customType)).toEqual(jasmine.objectContaining({
            "isVariable":false,
            "isSlideObject":false,
            "isQuery":false,
            "isCustomType":true,
            "value":"custom",
            "test":"hello"
        }));


    });

    it("should detect custom type in variable values", function () {

        var result,
            customType = jasmine.createSpy("customType").and.callFake(function (string, data) {

            if (string === "custom") {
                data.test = "hello";
                return true;
            } else {
                return false;
            }

        });

        result = _extra.variableManager.parse.string("variable_invalid", customType);
        expect(result.variable).toEqual(jasmine.objectContaining({
            "isVariable":false,
            "isSlideObject":false,
            "isQuery":false,
            "isCustomType":false,
            "value":"invalid"
        }));

        result = _extra.variableManager.parse.string("variable_custom", customType);
        expect(result.variable).toEqual(jasmine.objectContaining({
            "isVariable":false,
            "isSlideObject":false,
            "isQuery":false,
            "isCustomType":true,
            "value":"custom",
            "test":"hello"
        }));

    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// _extra.variableManager.parser.boolean
    ///////////////////////////////////////////////////////////////////////

    it("should allow us to parse numbers as booleans", function () {

        expect(_extra.variableManager.parse.boolean(1)).toBe(true);
        expect(_extra.variableManager.parse.boolean(0)).toBe(false);

    });

    it("should allow us to parse text", function () {

        expect(_extra.variableManager.parse.boolean("TRUE")).toBe(true);
        expect(_extra.variableManager.parse.boolean("FALSE")).toBe(false);
        expect(_extra.variableManager.parse.boolean("other")).toBe(true);

    });

    it("should treat numbers inside of strings as if they were numbers", function () {

        expect(_extra.variableManager.parse.boolean("1")).toBe(true);
        expect(_extra.variableManager.parse.boolean("0")).toBe(false);

    });

});