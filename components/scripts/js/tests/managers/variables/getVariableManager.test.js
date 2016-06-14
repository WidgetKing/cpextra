describe("A test suite to test local and session storage variable saving", function () {
    "use strict";

    var variables = {
        "get_var1":null,
        "get_var2":null,
        "get_invalidVar":null
    };

    var module = unitTests.getModule("getVariableManager");

    beforeEach(function () {
        window._extra = {
            "w":{
                "document":{
                    "location":{
                        "search":"?var1=value1&var2=value2"
                    }
                },
                "parseFloat":parseFloat,
                "isNaN":isNaN
            },
            "variableManager": {
                "prefixCallback": new unitTests.classes.Callback(),
                "getVariableValue":function (variableName) {
                    return variables[variableName];
                },
                "setVariableValue":function (variableName, value) {
                    variables[variableName] = value;
                }
            }
        };
        module();
    });

    afterEach(function () {
        delete window._extra;
    });



    it("should register for variables with the 'get' prefix", function () {
        expect(_extra.variableManager.prefixCallback.hasCallbackFor("get")).toBe(true);

        var varName = "get_my_name";
        expect(varName.substr(varName.indexOf("_") + 1, varName.length)).toBe("my_name");
    });

    it("should extract variable values from the URL and insert them into their corresponding variables", function () {
        _extra.variableManager.prefixCallback.sendToCallback("get","get_var1");
        expect(variables.get_var1).toBe("value1");
        _extra.variableManager.prefixCallback.sendToCallback("get","get_var2");
        expect(variables.get_var2).toBe("value2");
        _extra.variableManager.prefixCallback.sendToCallback("get","get_invalidVar");
        expect(variables.get_invalidVar).toBe(null);

    });

    it("should convert numbers into number, shouldn't leave them as strings", function () {
        _extra.w.document.location.search = "?var1=1";
        _extra.variableManager.prefixCallback.sendToCallback("get","get_var1");
        expect(variables.get_var1).toBe(1);
        expect(variables.get_var1).not.toBe("1");
    });

    it("should not add a 'get_' prefix onto a get variable that already has the 'get_' prefix", function () {
        _extra.w.document.location.search = "?get_var1=true";
        _extra.variableManager.prefixCallback.sendToCallback("get","get_var1");

        expect(variables.get_var1).toBe("true");
        expect(variables.get_get_var1).not.toBeDefined();
    });

    it("should work with variable names with underscores at their start", function () {
        variables = {
            "_get_var1":"value1",
            "_get_var2":"value2"
        };

        _extra.variableManager.prefixCallback.sendToCallback("get","_get_var1");
        _extra.variableManager.prefixCallback.sendToCallback("get","_get_var2");

        expect(variables._get_var1).toBe("value1");
        expect(variables._get_var2).toBe("value2");
    });

});