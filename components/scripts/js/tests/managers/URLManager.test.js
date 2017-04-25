/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 28/03/16
 * Time: 4:09 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the URL Manager", function () {

    "use strict";

    var module = unitTests.getModule("URLManager"),
        hookModule = unitTests.getModule("hookManager"),
        replaceVariableInStringModule = unitTests.getModule("replaceVariablesInString");

    beforeEach(function () {

        this.openURL = jasmine.createSpy("openURL");
        this.spy = this.openURL;

        var variables = {
            "foo":"foo",
            "bar":"bar",
            "foobar":"foobar"
        };

        window._extra = {
            "classes":unitTests.classes,
            "captivate":{
                "openURLLocation":this,
                "openURLMethodName":"openURL"
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

        replaceVariableInStringModule();
        hookModule();
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should replace variable names in URL string", function () {
        this.openURL("https://www.youtube.com/results?search_query=$$foobar$$");
        expect(this.spy).toHaveBeenCalledWith("https://www.youtube.com/results?search_query=foobar");
    });

    it("should not replace non-existant variables", function () {
        this.openURL("https://www.youtube.com/results?search_query=$$invalid$$");
        expect(this.spy).toHaveBeenCalledWith("https://www.youtube.com/results?search_query=$$invalid$$");
    });

    it("should replace multiple variables in URL string", function () {
        this.openURL("https://www.youtube.com/results?search_query=$$foobar$$&other=$$foo$$&evenmore=$$bar$$");
        expect(this.spy).toHaveBeenCalledWith("https://www.youtube.com/results?search_query=foobar&other=foo&evenmore=bar");
    });
});