/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 4/04/17
 * Time: 9:27 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.commandVariables", function () {

    "use strict";

    var module = unitTests.getModule("commandVariables_global"),
        processCommandVariable = unitTests.getModule("processCommandVariableRegistration");

    var register,
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

        processCommandVariable();
        module();
        register = _extra.variableManager.processCommandVariableRegistration;
        _extra.variableManager.registerCommandVariable.calls.reset();

    });

    afterEach(function () {
        delete window._extra;
    });

    it("should not throw any errors?", function () {



    });
});