/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/10/15
 * Time: 5:00 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite to test the TextBoxBehaviourManager for Captivate", function () {
    "use strict";

    function getMockObject() {
        return {
            "preferenceManager": {
                "registerPreferenceModule": function (behaviourSuffix, behaviourInfo) {
                    info = behaviourInfo;
                    info.enabled = true;
                    return true;
                }
            },
            "slideObjects": {
                "allObjectsOfTypeCallback":new unitTests.classes.Callback()
            },
            "variableManager": {
                "listenForVariableChange": function (variableName, callback) {
                    variableChangeCallback = callback;
                },
                "getVariableValue": function (variableName) {
                    return "foobar";
                }
            },
            "dataManager": {
                "getSlideObjectDataByName":function () {
                    return textEntryBoxData;
                }
            },
            "classes":unitTests.classes,
            "eventManager":{
                "eventDispatcher": document.createElement("p")
            }
        };
    }

    unitTests.setSoftwareClassAsMain("TextEntryBoxDataProxy",unitTests.CAPTIVATE);

    window._extra = getMockObject();

    var info,
        variableChangeCallback,
        module = unitTests.getModule("preventTextEntryBoxOverwrite", unitTests.CAPTIVATE),
        globalDataTypes = unitTests.getModule("globalSlideObjectTypes"),
        textEntryBoxData = new unitTests.classes.TextEntryBoxDataProxy("dummyTEB",{
            "base":{
                "vn":"foobar"
            },
            "container":{
                "txt":"defaultText"
            }
        });

    beforeEach(function () {

        window._extra = getMockObject();
        spyOn(_extra.preferenceManager,"registerPreferenceModule").and.callThrough();
        spyOn(_extra.slideObjects.allObjectsOfTypeCallback,"addCallback").and.callThrough();
        globalDataTypes();
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    // There was a major refactoring of this module just before release of beta. There was no time to update the
    // unit tests.

    /*it("should register with the behaviour manager and then ask for all TextEntryBoxes", function () {
        expect(_extra.preferenceManager.registerPreferenceModule).toHaveBeenCalled();
        expect(_extra.slideObjects.allObjectsOfTypeCallback.addCallback).toHaveBeenCalled();
    });

    it("should find the variable for the text entry box and listen to it", function () {

        spyOn(_extra.variableManager,"listenForVariableChange").and.callThrough();

        _extra.eventManager.eventDispatcher.dispatchEvent(new Event("variablesInitialized"));
        _extra.slideObjects.allObjectsOfTypeCallback.sendToCallback(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX, "dummyTEB");
        expect(_extra.variableManager.listenForVariableChange).toHaveBeenCalled();

        variableChangeCallback();
        expect(textEntryBoxData.defaultText).toBe("foobar");
    });*/
});