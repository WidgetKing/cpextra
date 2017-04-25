/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/04/17
 * Time: 4:54 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.variableManager.mathActions", function () {

    "use strict";

    var module = unitTests.getModule("mathActions"),
        variables;

    beforeEach(function () {

        variables = {
            "var":null,
            "1.1":1.1,
            "1.7":1.7,
            "1.5":1.5,
            "1.111111":1.111111,
            "5.55555555":5.55555555
        };

        window._extra = {
            "classes":unitTests.classes,
            "variableManager":{
                "getVariableValue":function (variableName) {
                    return variables[variableName];
                },
                "setVariableValue":function (variableName, value) {
                    variables[variableName] = value;
                }
            },
            "w":{
                "Math":Math
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.variableManager.mathActions object", function () {
        expect(_extra.variableManager.mathActions).toBeDefined();
    });

    it("should round variables", function () {

        _extra.variableManager.mathActions.round("1.1");
        expect(variables["1.1"]).toBe(1);

        _extra.variableManager.mathActions.round("1.7");
        expect(variables["1.7"]).toBe(2);

        _extra.variableManager.mathActions.round("1.5");
        expect(variables["1.5"]).toBe(2);

    });

    it("should floor variables", function () {

        _extra.variableManager.mathActions.floor("1.1");
        expect(variables["1.1"]).toBe(1);

        _extra.variableManager.mathActions.floor("1.7");
        expect(variables["1.7"]).toBe(1);

        _extra.variableManager.mathActions.floor("1.5");
        expect(variables["1.5"]).toBe(1);

    });

    it("should ceil variables", function () {

        _extra.variableManager.mathActions.ceil("1.1");
        expect(variables["1.1"]).toBe(2);

        _extra.variableManager.mathActions.ceil("1.7");
        expect(variables["1.7"]).toBe(2);

        _extra.variableManager.mathActions.ceil("1.5");
        expect(variables["1.5"]).toBe(2);

    });

    it("should allow us to round variables to a specific decimal", function () {

        _extra.variableManager.mathActions.roundTo("1.111111",1);
        expect(variables["1.111111"]).toBe(1.1);

        _extra.variableManager.mathActions.roundTo("5.55555555", 5);
        expect(variables["5.55555555"]).toBe(5.55556);

    });

    it("should allow us to round UP or DOWN to a specific decimal", function () {

        _extra.variableManager.mathActions.roundTo("1.111111", 1, "up");
        expect(variables["1.111111"]).toBe(1.2);

        _extra.variableManager.mathActions.roundTo("5.55555555", 5, "down");
        expect(variables["5.55555555"]).toBe(5.55555);

    });

    it("should allow us to generate a random number within a range", function () {

        var i = 0;
        while (i < 20) {

            _extra.variableManager.mathActions.random("var", 10, 0);
            expect(variables.var >= 0).toBe(true);
            expect(variables.var <= 10).toBe(true);
            // Not a decimal
            expect(variables.var.toString().indexOf(".")).toBe(-1);
            i += 1;

        }

    });

    it("should generate a random decimal number if set 0 and 1", function () {

        var i = 0;
        while (i < 20) {

            _extra.variableManager.mathActions.random("var", 1, 0);
            expect(variables.var >= 0).toBe(true);
            expect(variables.var <= 1).toBe(true);
            // A decimal
            expect(variables.var.toString().indexOf(".")).not.toBe(-1);
            i += 1;

        }

    });

    it("should allow us to set a lower limit for the random number", function () {

        var i = 0;
        while (i < 20) {

            _extra.variableManager.mathActions.random("var", 15, 10);
            expect(variables.var >= 10).toBe(true);
            expect(variables.var <= 15).toBe(true);
            // Not a decimal
            expect(variables.var.toString().indexOf(".")).toBe(-1);
            i += 1;

        }

    });
});