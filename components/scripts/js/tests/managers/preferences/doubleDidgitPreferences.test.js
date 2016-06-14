/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 6/06/16
 * Time: 1:11 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for doubleDidgitPreferences", function () {

    "use strict";

    var module = unitTests.getModule("doubleDidgitPreferences"),
        preferenceInfo = {},
        PREFIX = "xpref",
        variables = {
            "xprefUseDoubleDigitElapsedTimeValues":"",
            "xprefUseDoubleDigitTotalTimeValues":""
        };

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "preferences":{
                "calculateElapsedProjectTime":jasmine.createSpy("_extra.preferences.calculateElapsedProjectTime"),
                "calculateTotalProjectTime":jasmine.createSpy("_extra.preferences.calculateTotalProjectTime")
            },
            "preferenceManager":{
                "registerPreferenceModule":jasmine.createSpy("_extra.preferenceManager.registerPreferenceModule").and.callFake(function (name, info) {
                    preferenceInfo[name] = info;
                    info.name = PREFIX + name;
                    return true;
                })
            },
            "variableManager":{
                "setVariableValue":function (name, value) {
                    variables[name] = value;
                },
                "getVariableValue":function (name) {
                    return variables[name];
                }
            }
        };
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.preferences.doubleDidgits", function () {
        module();
        expect(_extra.preferences.doubleDidgits).toBeDefined();
    });

    it("should register the double didgit preference variables", function () {

        module();
        expect(_extra.preferenceManager.registerPreferenceModule).toHaveBeenCalledWith("UseDoubleDigitElapsedTimeValues", jasmine.any(Object));
        expect(_extra.preferenceManager.registerPreferenceModule).toHaveBeenCalledWith("UseDoubleDigitTotalTimeValues", jasmine.any(Object));

    });

    it("should update preferences to reflect the values we send it", function () {

        module();
        preferenceInfo.UseDoubleDigitElapsedTimeValues.update("HOURS, seconds");
        expect(_extra.preferences.doubleDidgits.ProjectElapsedHours).toBe(true);
        expect(_extra.preferences.doubleDidgits.ProjectElapsedMinutes).toBe(false);
        expect(_extra.preferences.doubleDidgits.ProjectElapsedSeconds).toBe(true);
        expect(_extra.preferences.calculateElapsedProjectTime).toHaveBeenCalled();

        preferenceInfo.UseDoubleDigitTotalTimeValues.update("minutes");
        expect(_extra.preferences.doubleDidgits.ProjectTotalHours).toBe(false);
        expect(_extra.preferences.doubleDidgits.ProjectTotalMinutes).toBe(true);
        expect(_extra.preferences.doubleDidgits.ProjectTotalSeconds).toBe(false);
        expect(_extra.preferences.calculateTotalProjectTime).toHaveBeenCalled();

    });

    it("should automatically apply the initial value of the preference variable", function () {

        variables.xprefUseDoubleDigitElapsedTimeValues = "none";
        variables.xprefUseDoubleDigitTotalTimeValues = "hours, seconds, minutes";
        module();

        expect(_extra.preferences.doubleDidgits.ProjectElapsedHours).toBe(false);
        expect(_extra.preferences.doubleDidgits.ProjectElapsedMinutes).toBe(false);
        expect(_extra.preferences.doubleDidgits.ProjectElapsedSeconds).toBe(false);

        expect(_extra.preferences.doubleDidgits.ProjectTotalHours).toBe(true);
        expect(_extra.preferences.doubleDidgits.ProjectTotalMinutes).toBe(true);
        expect(_extra.preferences.doubleDidgits.ProjectTotalSeconds).toBe(true);

    });
});