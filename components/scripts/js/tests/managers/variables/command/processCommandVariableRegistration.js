/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/04/17
 * Time: 1:14 PM
 * To change this template use File | Settings | File Templates.
 */
fdescribe("A test suite for _extra.variableManager.processCommandVariableRegistration", function () {

    "use strict";

    var module = unitTests.getModule("processCommandVariableRegistration"),
        register,
        changeVariable;

    beforeEach(function () {

        var variableMethods = {

        };

        changeVariable = function (name, value) {
            if (variableMethods.hasOwnProperty(name)) {
                variableMethods[name](value);
            }
        };

        window._extra = {
            "classes":unitTests.classes,
            "w":{
                "Array":Array
            },
            "variableManager":{
                "registerCommandVariable":jasmine.createSpy("variableManager.registerCommandVariable").and.callFake(function (name, method) {
                    variableMethods[name] = method;
                }),
                "commands":{},
                "parameterHandlers":{
                    "sendParametersAsParameters":jasmine.createSpy("sendParametersAsParameters")
                },
                "parseSets":{
                    "SP":{
                        "CD":{
                            "SOR":jasmine.createSpy("SP.CD.SOR"),
                            "SLR":jasmine.createSpy("SP.CD.SLR"),
                            "STR":jasmine.createSpy("SP.CD.STR")
                        }
                    },
                    "MP":{
                        "SOR_EVT_INT_CRI":jasmine.createSpy("SOR_EVT_INT_CRI"),
                        "SOR_STR":jasmine.createSpy("SOR_STR")
                    }
                }
            },
            "slideObjects":{
                "posX":jasmine.createSpy("slideObjects.posX"),
                "posY":jasmine.createSpy("slideObjects.posY"),
                "width":jasmine.createSpy("slideObjects.width"),
                "height":jasmine.createSpy("slideObjects.height"),
                "setCursor":jasmine.createSpy("slideObjects.setCursor"),
                "states":{
                    "change":jasmine.createSpy("slideObjects.states.change")
                }
            },
            "focusManager":{
                "lockFocusTo": jasmine.createSpy("lockFocusTo"),
                "unlockFocusFrom": jasmine.createSpy("unlockFocusFrom")
            },
            "TOCManager":{
                "completeSlide": jasmine.createSpy("completeSlide")
            },
            "actionManager":{
                "callActionOn": jasmine.createSpy("callActionOn")
            },
            "eventManager":{
                "events":{

                }
            }
        };

        module();
        register = _extra.variableManager.processCommandVariableRegistration;
        _extra.variableManager.registerCommandVariable.calls.reset();
    });

    afterEach(function () {
        delete window._extra;
    });


    it("should define the processCommandVariableRegistration method", function () {

        expect(_extra.variableManager.processCommandVariableRegistration).toBeDefined();

    });

    it("should allow us to register a basic command variable", function () {

        var data = {
            "varName":{
                "parseSet":jasmine.createSpy("parseSet")
            }
        };

        register(data);

        expect(_extra.variableManager.registerCommandVariable).toHaveBeenCalledWith("varName", jasmine.any(Function), undefined);

    });

    it("should allow us to register multiple variables at once", function () {

        var data = {
            "foo":{
                "parseSet":jasmine.createSpy("parseSet")
            },
            "bar":{
                "parseSet":jasmine.createSpy("parseSet")
            }
        };

        register(data);

        expect(_extra.variableManager.registerCommandVariable).toHaveBeenCalledWith("foo", jasmine.any(Function), undefined);
        expect(_extra.variableManager.registerCommandVariable).toHaveBeenCalledWith("bar", jasmine.any(Function), undefined);

    });

    it("should allow us to add this variable to the variableManager.commands object", function () {

        var data = {
            "varName":{
                "commandName":"foobar",
                "parseSet":jasmine.createSpy("parseSet")
            }
        };

        register(data);

        expect(_extra.variableManager.commands.foobar).toBeDefined();

    });

    it("should allow us to set a custom parameter handler", function () {

        var data = {
            "varName":{
                "parseSet":jasmine.createSpy("parseSet"),
                "parameterHandler": jasmine.createSpy("customParameterHandler")
            }
        };

        register(data);

        expect(_extra.variableManager.registerCommandVariable).toHaveBeenCalledWith("varName", jasmine.any(Function), data.varName.parameterHandler);

    });

    it("should send the parse set the parse data", function () {

        var data = {
            "varName":{
                "updateData":jasmine.createSpy("updateData"),
                "parseSet":jasmine.createSpy("parseSet"),
                "parseSetData":{}
            }
        };

        register(data);
        changeVariable("varName", "value");

        expect(data.varName.updateData).toHaveBeenCalledWith(data.varName.parseSetData, "value");
        expect(data.varName.parseSet).toHaveBeenCalledWith(data.varName.parseSetData);

    });
});