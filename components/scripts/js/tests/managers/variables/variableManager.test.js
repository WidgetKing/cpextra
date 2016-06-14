/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 28/09/15
 * Time: 3:20 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    function variableManagerTests(software, getMockObject) {

        var softwareModule = unitTests.getModule("variableManager_software", software),
            globalModule = unitTests.getModule("variableManager"),
            queryEngine = unitTests.getModule("queryManager");

        describe("Test suite to test the general variable manager in " + software, function () {

            var a = {};

            beforeEach(function () {
                a.dummy = function () {};
                spyOn(a,"dummy");
                window._extra = getMockObject();
                queryEngine();
                softwareModule();
                this.onLoadCallback = globalModule();
            });

            afterEach(function () {
                delete window._extra;
            });

            it("should define the _extra.variableManager object", function () {
                expect(_extra.variableManager).toBeDefined();
            });

            it("should create a callback for variable prefixes", function () {
                expect(_extra.variableManager.prefixCallback.constructor).toEqual(_extra.classes.Callback);
            });

            it("should notify callbacks about all variables existing with a certain prefix", function () {
                _extra.variableManager.prefixCallback.addCallback("ls", a.dummy);
                this.onLoadCallback();
                expect(a.dummy).toHaveBeenCalledWith("ls_localStorage");
            });

            it("should ignore case when matching prefixes", function () {
                _extra.variableManager.prefixCallback.addCallback("aa", a.dummy);
                this.onLoadCallback();
                expect(a.dummy).toHaveBeenCalledWith("AA_example");
            });

            it("should ignore underscores at the start of variable names", function () {
                _extra.variableManager.prefixCallback.addCallback("bb", a.dummy);
                this.onLoadCallback();
                expect(a.dummy).toHaveBeenCalledWith("_BB_example");
            });

            it("should define a getVariableValue function which returns the value of a passed in variable", function () {
                expect(_extra.variableManager.getVariableValue("ls_localStorage")).toEqual("local_storage_value");
            });

            it("should define a setVariableValue function which changes variable values", function () {
                _extra.variableManager.setVariableValue("ls_localStorage","foobar");
                expect(_extra.variableManager.getVariableValue("ls_localStorage")).toEqual("foobar");
            });

            it("should define a hasVariable function which informs us on whether or not a variable by this name exists", function () {
                expect(_extra.variableManager.hasVariable("ls_localStorage")).toBe(true);
                expect(_extra.variableManager.hasVariable("_zz_nonexistent")).toBe(false);
            });

            it("should define a listenForVariableChange function which executes a callback function when a variable changes", function () {
                expect(_extra.variableManager.listenForVariableChange).toBeDefined();
            });

            it("should define a stopListeningForVariableChange function which stops watching variables to notify you if they have changed", function () {
                expect(_extra.variableManager.stopListeningForVariableChange).toBeDefined();
            });

            it("should dispatch a 'variablesInitialized' event once the prefix tests have completed", function () {

                spyOn(_extra.eventManager.eventDispatcher, "dispatchEvent");
                expect(_extra.variableManager.hasParsedVariables).toBe(false);

                this.onLoadCallback();

                expect(_extra.eventManager.eventDispatcher.dispatchEvent).toHaveBeenCalled();
                expect(_extra.variableManager.hasParsedVariables).toBe(true);
                //expect(_extra.eventDispatcher.dispatchEvent.argsFor(0)[0].type).toEqual("storageVariablesLoaded");

            });

            it("should allow us to reset variables to their initial value", function () {

                var defaultValue = _extra.variableManager.getVariableValue("AA_example");

                // Shouldn't throw an error if we try to use it before its been setup
                expect(function () {
                    _extra.variableManager.reset("AA_example");
                }).not.toThrow();


                this.onLoadCallback();
                _extra.variableManager.setVariableValue("AA_example", "New Value");
                _extra.variableManager.reset("AA_example");
                expect(_extra.variableManager.getVariableValue("AA_example")).toBe(defaultValue);

                _extra.variableManager.reset("Invalid");
                expect(_extra.error.calls.argsFor(0)[0]).toBe("CV050");

            });

            it("should allow us to reset variables using @syntax", function () {

                var AA_Default = _extra.variableManager.getVariableValue("AA_example"),
                    BB_Default = _extra.variableManager.getVariableValue("_BB_example");

                this.onLoadCallback();
                _extra.variableManager.setVariableValue("AA_example", "New");
                _extra.variableManager.setVariableValue("_BB_example", "New");
                _extra.variableManager.setVariableValue("ss_sessionStorage", "New");
                _extra.variableManager.setVariableValue("ls_localStorage", "New");

                _extra.variableManager.reset("@_example");

                expect(_extra.variableManager.getVariableValue("AA_example")).toBe(AA_Default);
                expect(_extra.variableManager.getVariableValue("_BB_example")).toBe(BB_Default);
                expect(_extra.variableManager.getVariableValue("ss_sessionStorage")).toBe("New");
                expect(_extra.variableManager.getVariableValue("ls_localStorage")).toBe("New");

            });

        });

    }



    function getCaptivateMockObject() {
        var variables = {
            "Event":Event,
            "ls_localStorage":"local_storage_value",
            "ss_sessionStorage":"session_storage_value",
            "AA_example": "AA_example default value",
            "_BB_example": "_BB_example default value"
        };
        return {
            "captivate": {
                "api":{
                    "variablesManager":{
                        "varInfos":[
                            {
                                "name":"ls_localStorage",
                                "systemDefined":false
                            },
                            {
                                "name":"ss_sessionStorage",
                                "systemDefined":false
                            },
                            {
                                "name":"AA_example",
                                "systemDefined":false
                            },
                            {
                                "name":"_BB_example",
                                "systemDefined":false
                            }
                        ]
                    }
                },
                "interface":{
                    "getVariableValue":function (name) {
                        return _extra.w[name];
                    },
                    "setVariableValue":function (name,value) {
                        if (_extra.w[name]) {
                            _extra.w[name] = value;
                        }
                    }
                },
                "variables":variables,
                "variableManager":{
                    "getVariableValue":function (name) {
                        return _extra.w[name];
                    },
                    "setVariableValue":function (name,value) {
                        if (_extra.w[name]) {
                            _extra.w[name] = value;
                        }
                    }
                }
            },
            "classes":unitTests.classes,
            "w":variables,
            "eventManager": {
                "eventDispatcher": {
                    "dispatchEvent": function () {

                    }
                }
            },
            "createEvent": function (name) {
                return new unitTests.classes.CustomEvent(name);
            },
            "error":jasmine.createSpy("_extra.error")
        };
    }

    function getStorylineMockObject() {
        var variables = {
            "ls_localStorage":"local_storage_value",
            "ss_sessionStorage":"session_storage_value",
            "AA_example": "AA_example default value",
            "_BB_example": "_BB_example default value"
        };
        return {
            "storyline": {
                "variables": variables,
                "player": {
                    "GetVar":function(variableName) {
                        return _extra.storyline.variables[variableName];
                    },
                    "SetVar":function(name, value) {
                        if (_extra.storyline.variables[name]) {
                            _extra.storyline.variables[name] = value;
                        }
                    }
                }
            },
            "classes":unitTests.classes,
            "eventManager": {
                "eventDispatcher": {
                    "dispatchEvent": function () {

                    }
                }
            },
            "w":{
                "Event":Event
            },
            "createEvent": function (name) {
                return new unitTests.classes.CustomEvent(name);
            },
            "error": jasmine.createSpy("_extra.error")
        };
    }

    variableManagerTests(unitTests.CAPTIVATE, getCaptivateMockObject);

    variableManagerTests(unitTests.STORYLINE, getStorylineMockObject);

}());