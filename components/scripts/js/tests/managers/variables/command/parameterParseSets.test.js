/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 14/06/16
 * Time: 11:36 AM
 * To change this template use File | Settings | File Templates.
 */
fdescribe("A test suite for the parameterParseSets", function () {

    "use strict";

    var module = unitTests.getModule("parameterParseSets"),
        parameterParser = unitTests.getModule("parameterParser"),
        queryEngine = unitTests.getModule("queryManager"),
        whiteSpaceManager = unitTests.getModule("whiteSpaceManager"),
        variables,
        slideObjects;

    beforeEach(function () {

        slideObjects = {

        };
        variables = {

        };

        window._extra = {
            "classes":unitTests.classes,
            "variableManager":{

            },
            "slideObjects":{
                "WILDCARD_CHARACTER":"@",
                "hasSlideObjectInProject":function (name) {
                    return slideObjects.hasOwnProperty(name);
                }
            },
            "w":{
                "parseFloat":parseFloat,
                "parseInt":parseInt,
                "isNaN":isNaN
            }
        };

        unitTests.createVariableGetterSetter(_extra.variableManager, variables);

        queryEngine();
        whiteSpaceManager();
        parameterParser();
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the parseSets object", function () {
        expect(_extra.variableManager.parseSets).toBeDefined();
    });


});