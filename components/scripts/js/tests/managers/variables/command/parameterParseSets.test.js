/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 14/06/16
 * Time: 11:36 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the parameterParseSets", function () {

    "use strict";

    var module = unitTests.getModule("parameterParseSets"),
        parameterParser = unitTests.getModule("parameterParser"),
        queryEngine = unitTests.getModule("queryManager"),
        whiteSpaceManager = unitTests.getModule("whiteSpaceManager"),
        variables,
        slideObjectQueries,
        variableQueries,
        slideNames,
        dummy,
        testSet,
        slideObjects;

    beforeEach(function () {

        slideObjects = {
            "slideObject":true,
            "syntax1":true,
            "syntax2":true
        };
        variables = {
            "variable":"value",
            "variableVariable":"variable",
            "variableVar@":"var@",
            "variable1":1,
            "slideObjectVariable":"slideObject",
            "syntaxVariable":"syntax@",
            "variableSlide1":"slide1",
            "variableSlide2":"slide2",
            "variableSlide10":"slide10",
            "variableWithSameNameAsSlide":"slide1"
        };
        slideObjectQueries = {
            "syntax@": [
                "syntax1",
                "syntax2"
            ]
        };
        variableQueries = {
            "var@": [
                "var1",
                "var2"
            ]
        };
        slideNames = {
            "slide1":{
                "scene":1,
                "slide":1
            },
            "slide2": {
                "scene":1,
                "slide":2
            },
            "slide10": {
                "scene":1,
                "slide":10
            },
            "variableWithSameNameAsSlide": {
                "scene":1,
                "slide":99
            }
        };
        dummy = jasmine.createSpy("dummy"); //_extra.slideManager.getSlideIndexFromName

        window._extra = {
            "error":jasmine.createSpy("_extra.error"),
            "classes":unitTests.classes,
            "variableManager":{
                "enactFunctionOnVariables":function (query, method) {
                    if (variableQueries.hasOwnProperty(query)) {

                        for (var i = 0; i < variableQueries[query].length; i += 1) {
                            method(variableQueries[query][i]);
                        }

                    }
                }
            },
            "slideManager":{
                "getSlideIndexFromName": function (name) {
                    return slideNames[name];
                },
                "enactFunctionOnSlides": function (query, method) {
                    var list = _extra.queryList(query, slideNames);

                    for (var i = 0; i < list.length; i += 1) {
                        method(list[i]);

                    }
                }
            },
            "slideObjects":{
                "WILDCARD_CHARACTER":"@",
                "hasSlideObjectInProject":function (name) {
                    return slideObjects.hasOwnProperty(name);
                },
                "enactFunctionOnSlideObjects":function (query, method) {
                    if (slideObjectQueries.hasOwnProperty(query)) {

                        for (var i = 0; i < slideObjectQueries[query].length; i += 1) {
                            method(slideObjectQueries[query][i]);
                        }

                    }
                }
            },
            "w":{
                "parseFloat":parseFloat,
                "parseInt":parseInt,
                "isNaN":isNaN,
                "Array":Array
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

    ///////////////////////////////////////////////////////////////////////
    /////////////// SP.CD.SOR
    ///////////////////////////////////////////////////////////////////////
    describe("A test suite for SP.CD.VR", function () {

        beforeEach(function () {
            testSet = _extra.variableManager.parseSets.SP.CD.VR;
        });

        it("should parse a loose variable name", function () {

            testSet("variableVariable", dummy);

            expect(dummy).toHaveBeenCalledWith("variableVariable");

        });

        it("should call the output method for each variable matching an @syntax query", function () {

            testSet("var@", dummy);

            expect(dummy).toHaveBeenCalledWith("var1");
            expect(dummy).toHaveBeenCalledWith("var2");

        });

        it("should use a $variable's value", function () {

            testSet("$$variableVariable$$", dummy);

            expect(dummy).toHaveBeenCalledWith("variable");

            testSet("$$variableVar@$$", dummy);

            expect(dummy).toHaveBeenCalledWith("var1");
            expect(dummy).toHaveBeenCalledWith("var2");

        });

        it("should call a backup method if we send an invalid variable name AND we defined a backup method", function () {

            var backup = jasmine.createSpy("backup");

            testSet("invalid", dummy, backup);

            expect(dummy).not.toHaveBeenCalled();
            expect(backup).toHaveBeenCalledWith("invalid", dummy);

        });

    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// SP.CD.SOR
    ///////////////////////////////////////////////////////////////////////
    describe("A test suite for SP.CD.SOR", function () {

        beforeEach(function () {
            testSet = _extra.variableManager.parseSets.SP.CD.SOR;
        });

        it("should parse a loose slide object name", function () {

            testSet("slideObject", dummy);

            expect(dummy).toHaveBeenCalledWith("slideObject");

        });

        it("should parse a loose variable name with a slide object inside it", function () {

            testSet("slideObjectVariable", dummy);

            expect(dummy).toHaveBeenCalledWith("slideObject");

        });

        it("should parse an @syntax query", function () {

            testSet("syntax@", dummy);

            expect(dummy).toHaveBeenCalledWith("syntax1");
            expect(dummy).toHaveBeenCalledWith("syntax2");

        });
        
        it("should accept a string", function () {
            
            testSet('"slideObject"', dummy);

            expect(dummy).toHaveBeenCalledWith("slideObject");
            
        });

        it("should not accept a variable inside of a string", function () {

            testSet('"slideObjectVariable"', dummy);

            expect(dummy).not.toHaveBeenCalled();

            expect(_extra.error).toHaveBeenCalledWith("CV001", jasmine.anything());

        });

        it("should accept a $var", function () {

            testSet("$$slideObjectVariable$$", dummy);

            expect(dummy).toHaveBeenCalledWith("slideObject");

        });

    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// MD.SOR_STR
    ///////////////////////////////////////////////////////////////////////
    describe("A test suite for SP.CD.STR", function () {

        beforeEach(function () {
            testSet = _extra.variableManager.parseSets.SP.CD.STR;
        });
        
        it("should send a string directly through if it doesn't match a variable", function () {
            
            expect(testSet("foobar")).toBe("foobar");
            expect(testSet('"foobar"')).toBe("foobar");
            
        });

        it("should give us the variable's value if we pass in a variable name", function () {

            expect(testSet("slideObjectVariable")).toBe("slideObject");
            expect(testSet("$$slideObjectVariable$$")).toBe("slideObject");

        });
        
    });


    ///////////////////////////////////////////////////////////////////////
    /////////////// SP.CD_SLR
    ///////////////////////////////////////////////////////////////////////
    fdescribe("A test suite for SP.CD_SLR", function () {

        beforeEach(function () {
            testSet = _extra.variableManager.parseSets.SP.CD.SLR;
        });
        
        it("should return us a slide name if we send it a direct slide name or number", function () {

            testSet('"invalid"', dummy);
            expect(dummy).not.toHaveBeenCalled();
            testSet('"slide1"', dummy);
            expect(dummy).toHaveBeenCalledWith(1);

            testSet(6, dummy);
            expect(dummy).toHaveBeenCalledWith(6);
            testSet("7", dummy);
            expect(dummy).toHaveBeenCalledWith(7);
            
        });

        it("should return us a slide number if it comes from a variable", function () {

            testSet("$$variableSlide10$$", dummy);
            expect(dummy).toHaveBeenCalledWith(10);

            testSet("variableSlide2", dummy);
            expect(dummy).toHaveBeenCalledWith(2);

            testSet("variable1", dummy);
            expect(dummy).toHaveBeenCalledWith(1);



        });

        it("should use slide names first when a variable and a slide share the same name", function () {

            testSet("variableWithSameNameAsSlide", dummy);
            expect(dummy).toHaveBeenCalledWith(99);

            testSet("$$variableWithSameNameAsSlide$$", dummy);
            expect(dummy).toHaveBeenCalledWith(1);

        });

        it("should accept an @syntax range of slides", function () {

            testSet("slide@", dummy);
            expect(dummy).toHaveBeenCalledWith(1);
            expect(dummy).toHaveBeenCalledWith(2);
            expect(dummy).toHaveBeenCalledWith(10);

        });

        xit("should be able to distinguish between valid and invalid ranges", function () {

            testSet("1-3", dummy);
            expect(dummy).toHaveBeenCalledWith(1);
            expect(dummy).toHaveBeenCalledWith(2);
            expect(dummy).toHaveBeenCalledWith(3);

        });
        
    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// MD.SOR_SR
    ///////////////////////////////////////////////////////////////////////
    describe("A test suite for MD.SOR_STR", function () {

        beforeEach(function () {
            testSet = _extra.variableManager.parseSets.MP.SOR_STR;
        });

        it("should send the first parameter through SOR and the second through STR", function () {

            spyOn(_extra.variableManager.parseSets.SP.CD, "SOR").and.callFake(function (query, output) {
                output("SOR");
            });
            spyOn(_extra.variableManager.parseSets.SP.CD, "STR").and.returnValue("STR");

            testSet("p1", "p2", dummy);

            expect(dummy).toHaveBeenCalledWith("SOR", "STR");
            expect(_extra.variableManager.parseSets.SP.CD.SOR).toHaveBeenCalledWith("p1", jasmine.anything());
            expect(_extra.variableManager.parseSets.SP.CD.STR).toHaveBeenCalledWith("p2");

        });

    });
});