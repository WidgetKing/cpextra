/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 6:18 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for preferences.saveLocalStorage", function () {

    "use strict";

    var module = unitTests.getModule("saveLocalStoragePreference"),
        info,
        listeners;

    function createEvent(name) {
        return {
            "type":name
        };
    }

    beforeEach(function () {

        listeners = {

        };

        window._extra = {
            "w":{
                "addEventListener":jasmine.createSpy("_extra.w.addEventListener"),
                "removeEventListener":jasmine.createSpy("_extra.w.removeEventListener"),
                "isNaN":isNaN
            },
            "eventManager":{
                "eventDispatcher": new unitTests.classes.EventDispatcher()
            },
            "classes":unitTests.classes,
            "preferenceManager": {
                "registerPreferenceModule": function (behaviourSuffix, behaviourInfo) {
                    info = behaviourInfo;
                    info.enabled = true;
                    return true;
                }
            },
            "slideManager":{
                "enterSlideCallback": new unitTests.classes.Callback()
            },
            "variableManager": {
                "hasParsedVariables":false,
                "saveStorageVariables": jasmine.createSpy("_extra.variableManager.saveStorageVariables"),
                "saveStorageVariable": jasmine.createSpy("_extra.variableManager.saveStorageVariable"),
                "listenForVariableChange": jasmine.createSpy("variableManager.listenForVariableChange").and.callFake(function (variableName, callback) {
                    listeners[variableName] = callback;
                }),
                "stopListeningForVariableChange": jasmine.createSpy("variableManager.stopListeningForVariableChange"),
                "storageVariables":{
                    "ls_localStorage":{

                    },
                    "ss_sessionStorage":{

                    }
                }
            }
        };

    });

    afterEach(function () {
        delete window._extra;
    });

    it("should save local storage on slide enter when set to 'onslideenter'", function () {

        module();

        info.enable();
        info.update("ONSLIDEENTER");

        _extra.slideManager.enterSlideCallback.sendToCallback("*", "1.2");

        expect(_extra.variableManager.saveStorageVariables).toHaveBeenCalled();

        info.disable();

        expect(_extra.slideManager.enterSlideCallback.hasCallbackFor("*")).toBe(false);

    });

    it("should save local storage on movie exit when we set to 'onexit'", function () {

        module();

        info.enable();
        info.update("onExit");
        expect(_extra.w.addEventListener).toHaveBeenCalledWith("unload", jasmine.any(Function));

        // Call the event handler.
        _extra.w.addEventListener.calls.argsFor(0)[1]();
        expect(_extra.variableManager.saveStorageVariables).toHaveBeenCalled();

        info.disable();
        expect(_extra.w.removeEventListener).toHaveBeenCalledWith("unload", jasmine.any(Function));

    });

    it("should allow local storage to be saved every time a variable changes", function () {

        module();

        // So that it knows the CpExtra has already analysed the variables.
        _extra.variableManager.hasParsedVariables = true;

        info.enable();
        info.update("onCHANGE");

        expect(_extra.variableManager.listenForVariableChange).toHaveBeenCalledWith("ls_localStorage", jasmine.any(Function));
        expect(_extra.variableManager.listenForVariableChange).toHaveBeenCalledWith("ss_sessionStorage", jasmine.any(Function));

        listeners["ls_localStorage"]({
            "variableName":"ls_localStorage"
        });
        expect(_extra.variableManager.saveStorageVariable).toHaveBeenCalledWith("ls_localStorage");

        listeners["ss_sessionStorage"]({
            "variableName":"ss_sessionStorage"
        });
        expect(_extra.variableManager.saveStorageVariable).toHaveBeenCalledWith("ss_sessionStorage");

    });

    it("should save local storage on variable change even if there's no variable", function () {

        spyOn(_extra.preferenceManager, "registerPreferenceModule").and.returnValue(false);

        module();

        _extra.variableManager.hasParsedVariables = true;
        _extra.eventManager.eventDispatcher.dispatchEvent(createEvent("variablesInitialized"));

        expect(_extra.variableManager.listenForVariableChange).toHaveBeenCalledWith("ls_localStorage", jasmine.any(Function));
        expect(_extra.variableManager.listenForVariableChange).toHaveBeenCalledWith("ss_sessionStorage", jasmine.any(Function));

    });
});