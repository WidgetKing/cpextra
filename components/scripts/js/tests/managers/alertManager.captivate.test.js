/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 25/04/17
 * Time: 1:55 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.alertManager", function () {

    "use strict";

    var module = unitTests.getModule("alertManager", unitTests.CAPTIVATE),
        replaceVariableModule = unitTests.getModule("replaceVariablesInString"),
        baseAlert,
        baseFirstButtonAction;


    beforeEach(function () {

        var variables = {
            "there":"there",
            "are":"are"
        };

        baseFirstButtonAction = jasmine.createSpy("base.firstButtonAction");

        baseAlert = {
            "show": jasmine.createSpy("baseAlert.show"),
            "m_firstButtonHandler": baseFirstButtonAction,
            "registerFirstButtonHandler":function (action) {
                baseAlert.m_firstButtonHandler = action;
            }
        };

        window._extra = {
            "classes":unitTests.classes,
            "captivate":{
                "api":{
                    "ShowWarning": jasmine.createSpy("_extra.cp.ShowWarning")
                        .and.callFake(function (message, title, show, anotherThing) {

                            baseAlert.message = message;
                            baseAlert.title = title;
                            return baseAlert;

                    })
                }
            },
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

        replaceVariableModule();
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.alertManager object", function () {
        expect(_extra.alertManager).toBeDefined();
    });

    it("should allow us to create an alert", function () {

        var data = {
            "message": "message"
        };

        _extra.alertManager.sendAlert(data);
        expect(baseAlert.message).toBe(data.message);
        expect(baseAlert.show).toHaveBeenCalled();

        baseAlert.m_firstButtonHandler();
        expect(baseFirstButtonAction).toHaveBeenCalled();

    });

    it("should allow us to set a firstButtonAction", function () {

        var data = {
            "message": "foo",
            "title": "bar",
            "firstButtonAction": jasmine.createSpy("firstButtonAction")
        };

        _extra.alertManager.sendAlert(data);

        expect(baseAlert.message).toBe(data.message);
        expect(baseAlert.title).toBe(data.title);
        expect(baseAlert.show).toHaveBeenCalled();

        baseAlert.m_firstButtonHandler();
        expect(baseFirstButtonAction).toHaveBeenCalled();
        expect(data.firstButtonAction).toHaveBeenCalled();

    });

    it("should replace variables written in the message or title", function () {

        var data = {
            "message": "Hello $$there$$ world",
            "title": "How $$are$$ you?"
        };

        _extra.alertManager.sendAlert(data);
        expect(baseAlert.message).toBe("Hello there world");
        expect(baseAlert.title).toBe("How are you?");

    });
});