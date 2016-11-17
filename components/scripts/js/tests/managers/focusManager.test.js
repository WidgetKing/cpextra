/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/11/16
 * Time: 10:37 AM
 * To change this template use File | Settings | File Templates.
 */
fdescribe("A test suite for _extra.focusManager", function () {

    "use strict";

    var module = unitTests.getModule("focusManager");

    beforeEach(function () {

        var that = this,
            onEvents = {};

        /*this.$ = {
            "on":function () {

            }
        };

        this.keydownTAB = function () {

        };*/

        window._extra = {
            "classes":unitTests.classes,
            "$": function () {
                return that.$;
            },
            "dataManager":{
                "getSlideObjectDataByName": function (name) {
                    if (name === "TextEntryBox") {
                        return {
                            "type":_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX,
                            "inputDivName": name + "_inputField"
                        };
                    } else {
                        return {
                            "type":0
                        };
                    }
                }
            },
            "dataTypes":{
                "slideObjects":{
                    "TEXT_ENTRY_BOX":1
                }
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.focusManager", function () {
        expect(_extra.focusManager).toBeDefined();
    });

    it("should send us the name of the specific DIV which needs to be focused on for a certain slide object", function () {

        expect(_extra.focusManager.getSlideObjectFocusDivName("Normal")).toBe("Normal");
        expect(_extra.focusManager.getSlideObjectFocusDivName("TextEntryBox")).toBe("TextEntryBox_inputField");

    });

    /*it("should refocus on an object when we try to tab away from it", function () {

        _extra.focusManager.lockFocusOn("normalSlideObject");

        keydownTAB();
        expect(this.$.focus).toHaveBeenCalledWith("normalSlideObject");

    });*/
});