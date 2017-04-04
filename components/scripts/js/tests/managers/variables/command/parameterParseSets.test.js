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
        testData,
        slideObjects;

    beforeEach(function () {

        slideObjects = {
            "slideObject":true,
            "syntax1":true,
            "syntax2":true,
            "interactiveObject":true
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
                "slide":1 // Note: the slide numbers are reduced by 1 by the getSlideIndexFromName method
            },
            "slide2": {
                "scene":1,
                "slide":2
            },
            "slide3": {
                "scene":1,
                "slide":3
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
                "numSlides":100,
                "getSlideIndexFromName": function (name) {
                    var details = slideNames[name];
                    if (details) {
                        details.slide -= 1;
                    }
                    return details;
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
                "Array":Array,
                "String":String
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
            testData = {
                "output":dummy
            }
        });

        it("should parse a loose variable name", function () {

            testData.query = "variableVariable";
            testSet(testData);

            expect(dummy).toHaveBeenCalledWith("variableVariable");

        });

        it("should call the output method for each variable matching an @syntax query", function () {

            testData.query = "var@";
            testSet(testData);

            expect(dummy).toHaveBeenCalledWith("var1");
            expect(dummy).toHaveBeenCalledWith("var2");

        });

        it("should use a $variable's value", function () {

            testData.query = "$$variableVariable$$";
            testSet(testData);

            expect(dummy).toHaveBeenCalledWith("variable");

            testData.query = "$$variableVar@$$";
            testSet(testData);

            expect(dummy).toHaveBeenCalledWith("var1");
            expect(dummy).toHaveBeenCalledWith("var2");

        });

        it("should call a backup method if we send an invalid variable name AND we defined a backup method", function () {

            testData.exceptions = {
                "invalidName": jasmine.createSpy("backup")
            };
            testData.query = "invalid";
            testSet(testData);

            expect(dummy).not.toHaveBeenCalled();
            expect(testData.exceptions.invalidName).toHaveBeenCalledWith("invalid");
            expect(_extra.error).toHaveBeenCalledWith("CV002", jasmine.anything());

        });

        it("should allow us to define another method to be used to handle @syntax", function () {

            testData.query = "var@";
            testData.alternateQueryHandler = jasmine.createSpy("alternateQueryHandler");
            testSet(testData);

            expect(testData.alternateQueryHandler).toHaveBeenCalledWith("var@", dummy);

        });

    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// SP.CD.SOR
    ///////////////////////////////////////////////////////////////////////
    describe("A test suite for SP.CD.SOR", function () {

        beforeEach(function () {
            testSet = _extra.variableManager.parseSets.SP.CD.SOR;
            testData = {
                "output":dummy
            }
        });

        it("should parse a loose slide object name", function () {

            testData.query = "slideObject";
            testSet(testData);

            expect(dummy).toHaveBeenCalledWith("slideObject");

        });

        it("should parse a loose variable name with a slide object inside it", function () {

            testData.query = "slideObjectVariable";
            testSet(testData);

            expect(dummy).toHaveBeenCalledWith("slideObject");

        });

        it("should parse an @syntax query", function () {

            testData.query = "syntax@";
            testSet(testData);

            expect(dummy).toHaveBeenCalledWith("syntax1");
            expect(dummy).toHaveBeenCalledWith("syntax2");

        });

        it("should allow us to prevent @syntax from being used", function () {

            testData.query = "syntax@";
            testData.noQueries = true;
            testSet(testData);

            expect(_extra.error).toHaveBeenCalledWith("CV004", "syntax@");

            expect(dummy).not.toHaveBeenCalled();

        });

        it("should allow us to run an exception when an illegal @syntax is used", function () {

            testData.query = "syntax@";
            testData.noQueries = true;
            testData.exceptions = {
                "illegalQuery": jasmine.createSpy("exceptions.illegalQuery").and.returnValue("foobar")
            };
            testSet(testData);

            expect(_extra.error).not.toHaveBeenCalled();

            expect(testData.exceptions.illegalQuery).toHaveBeenCalled();
            expect(dummy).toHaveBeenCalledWith("foobar");

        });
        
        it("should accept a string", function () {

            testData.query = '"slideObject"';
            testSet(testData);

            expect(dummy).toHaveBeenCalledWith("slideObject");
            
        });

        it("should not accept a variable inside of a string", function () {

            testData.query = '"slideObjectVariable"';
            testSet(testData);

            expect(dummy).not.toHaveBeenCalled();

            expect(_extra.error).toHaveBeenCalledWith("CV001", jasmine.anything());

        });

        it("should accept a $var", function () {

            testData.query = '$$slideObjectVariable$$';
            testSet(testData);

            expect(dummy).toHaveBeenCalledWith("slideObject");

        });

        it("should allow us to handle exceptions", function () {

            testData.query = "invalid";
            testData.exceptions = {
                "invalidName": jasmine.createSpy("exceptions.invalidName").
                               and.callFake(
                function (issue) {
                    expect(issue).toBe("invalid");
                    return "foobar";
                })
            };

            testSet(testData);

            expect(testData.exceptions.invalidName).toHaveBeenCalled();
            expect(dummy).toHaveBeenCalledWith("foobar");
            expect(_extra.error).not.toHaveBeenCalled();

        });

        it("should allow exceptions to fail and throw an error", function () {

            testData.query = "invalid";
            testData.exceptions = {
                "invalidName": jasmine.createSpy("exceptions.invalidName").
                    and.callFake(
                    function (issue) {
                        expect(issue).toBe("invalid");
                        return false;
                    })
            };

            testSet(testData);

            expect(testData.exceptions.invalidName).toHaveBeenCalled();
            expect(dummy).not.toHaveBeenCalled();
            expect(_extra.error).toHaveBeenCalledWith("CV001", "invalid");

        });

        it("should allow us to throw an exception which doesn't call the function, but doesn't throw an error", function () {

            testData.query = "invalid";
            testData.exceptions = {
                "invalidName": jasmine.createSpy("exceptions.invalidName").
                    and.callFake(
                    function (issue) {
                        expect(issue).toBe("invalid");
                        return _extra.variableManager.parseSets.SKIP_ERROR;
                    })
            };

            testSet(testData);

            expect(testData.exceptions.invalidName).toHaveBeenCalled();
            expect(dummy).not.toHaveBeenCalled();
            expect(_extra.error).not.toHaveBeenCalled();

        });

    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// MD.SOR_STR
    ///////////////////////////////////////////////////////////////////////
    describe("A test suite for SP.CD.STR", function () {

        beforeEach(function () {
            testData = {
                "output":dummy
            };
            testSet = _extra.variableManager.parseSets.SP.CD.STR;
        });

        it("should send a string directly through if it doesn't match a variable", function () {

            testData.string = "foo";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith("foo");

            testData.string = '"bar"';
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith("bar");

        });

        it("should send us through a number as a string", function () {

            testData.string = "1";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith("1");

            testData.string = "2";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith("2");

        });

        it("should give us the variable's value if we pass in a variable name", function () {

            testData.string = "slideObjectVariable";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith("slideObject");

            dummy.calls.reset();

            testData.string = "$$slideObjectVariable$$";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith("slideObject");


        });

        it("should allow us to validate strings", function () {

            var spy = jasmine.createSpy("spy");
            testData.exceptions = {
                "invalidString":spy
            };


            testData.string = "foo";
            testData.validation = {
                "foo":null
            };
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith("foo");

            testData.string = "bar";
            testData.validation = {
                "bar":null
            };
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith("bar");

            testData.string = "bar";
            testData.validation = {
                "foobar":"invalid",
                "bar":"moo"
            };
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith("moo");


            expect(spy).not.toHaveBeenCalled();

            /*
            expect(testSet("foobar", {"foo":"bar", "foobar":"bar"}, spy)).toBe("bar");



            // Exceptions
            expect(testSet("INVALID", {"foo":"bar"}, spy)).toBe(null);
            expect(spy).toHaveBeenCalledWith("INVALID");
            */

        });

        it("should throw exceptions if strings don't match validation", function () {

            var spy = jasmine.createSpy("spy");
            testData.exceptions = {
                "invalidString":spy
            };

            testData.string = "INVALID";
            testData.validation = {
                "foo":"bar"
            };
            testSet(testData);
            expect(dummy).not.toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith("INVALID");
            expect(_extra.error).toHaveBeenCalledWith("CV003", jasmine.any(String));


            _extra.error.calls.reset();

            spy.and.returnValue("corrected");
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith("corrected");
            expect(_extra.error).not.toHaveBeenCalled();

        });

        it("should allow us to set what case the string will be compared to the validation", function () {

            testData.string = "valid";
            testData.validation = {
                "VALID":null
            };

            testSet(testData);
            expect(dummy).not.toHaveBeenCalled();
            expect(_extra.error).toHaveBeenCalled();

            testData.validationCase = "upper";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith("VALID");

        });

    });


    ///////////////////////////////////////////////////////////////////////
    /////////////// SP.CD_SLR
    ///////////////////////////////////////////////////////////////////////
    describe("A test suite for SP.CD_SLR", function () {

        beforeEach(function () {
            testSet = _extra.variableManager.parseSets.SP.CD.SLR;
            testData = {
                "output":dummy
            };
        });
        
        it("should return us a slide name if we send it a direct slide name or number", function () {

            testData.query = '"invalid"';
            testSet(testData);
            expect(dummy).not.toHaveBeenCalled();

            testData.query = '"slide1"';
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(1);


            testData.query = 6;
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(6);

            testData.query = "7";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(7);
            
        });

        it("should return us a slide number if it comes from a variable", function () {

            testData.query = "$$variableSlide10$$";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(10);

            testData.query = "variableSlide2";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(2);

            testData.query = "variable1";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(1);



        });

        it("should use slide names first when a variable and a slide share the same name", function () {

            testData.query = "variableWithSameNameAsSlide";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(99);

            testData.query = "$$variableWithSameNameAsSlide$$";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(1);

        });

        it("should accept an @syntax range of slides", function () {

            testData.query = "slide@";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(1);
            expect(dummy).toHaveBeenCalledWith(2);
            expect(dummy).toHaveBeenCalledWith(10);

        });

        it("should be able to accept number ranges", function () {

            testData.query = "1-3";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(1);
            expect(dummy).toHaveBeenCalledWith(2);
            expect(dummy).toHaveBeenCalledWith(3);

            expect(dummy).not.toHaveBeenCalledWith(4);
            expect(dummy).not.toHaveBeenCalledWith(0);

            testData.query = "7-5";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(7);
            expect(dummy).toHaveBeenCalledWith(6);
            expect(dummy).toHaveBeenCalledWith(5);

            testData.query = "9-9";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(9);

        });

        it("should be able to use slide names in ranges", function () {

            testData.query = "slide1-slide2";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(1);
            expect(dummy).toHaveBeenCalledWith(2);

            testData.query = "slide3-5";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(3);
            expect(dummy).toHaveBeenCalledWith(4);
            expect(dummy).toHaveBeenCalledWith(5);

            testData.query = "12-slide10";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(12);
            expect(dummy).toHaveBeenCalledWith(11);
            expect(dummy).toHaveBeenCalledWith(10);

        });

        it("should output every slide number if passed 'all'", function () {

            _extra.slideManager.numSlides = 3;

            testData.query = "all";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(1);
            expect(dummy).toHaveBeenCalledWith(2);
            expect(dummy).toHaveBeenCalledWith(3);

            dummy.calls.reset();

            testData.query = "ALL";
            testSet(testData);
            expect(dummy).toHaveBeenCalledWith(1);
            expect(dummy).toHaveBeenCalledWith(2);
            expect(dummy).toHaveBeenCalledWith(3);

            expect(_extra.error).not.toHaveBeenCalled();

        });

        it("should report an error if we pass it invalid ranges", function () {

            testData.query = "1-3-5";
            testSet(testData);
            expect(_extra.error).toHaveBeenCalledWith("CV070", jasmine.anything());
            expect(dummy).not.toHaveBeenCalled();

            _extra.error.calls.reset();

            testData.query = "1-";
            testSet(testData);
            expect(_extra.error).toHaveBeenCalledWith("CV070", jasmine.anything());
            expect(dummy).not.toHaveBeenCalled();

        });

        it("should report error if we pass an invalid slide name", function () {

            testData.query = "invalidSlide";
            testSet(testData);
            expect(_extra.error).toHaveBeenCalledWith("CV071", jasmine.anything());
            expect(dummy).not.toHaveBeenCalled();

            _extra.error.calls.reset();

            testData.query = "invalidSlide-5";
            testSet(testData);
            expect(_extra.error).toHaveBeenCalledWith("CV071", jasmine.anything());
            expect(dummy).not.toHaveBeenCalled();

            _extra.error.calls.reset();

            testData.query = "5-invalidSlide";
            testSet(testData);
            expect(_extra.error).toHaveBeenCalledWith("CV071", jasmine.anything());
            expect(dummy).not.toHaveBeenCalled();

        });

        it("should allow us to handle the invalidSlide exception gracefully with a single slide", function () {

            testData.query = "invalidSlide";
            testData.exceptions = {
                "invalidSlide":jasmine.createSpy("exceptions.invalidSlide").and.callFake(function () {
                    return 7
                })
            };
            testSet(testData);
            expect(testData.exceptions.invalidSlide).toHaveBeenCalledWith("invalidSlide");
            expect(_extra.error).not.toHaveBeenCalled();
            expect(dummy).toHaveBeenCalledWith(7);


        });

        it("should allow us to handle the invalidSlide exception gracefully within a range", function () {

            testData.query = "5-invalidSlide";
            testData.exceptions = {
                "invalidSlide":jasmine.createSpy("exceptions.invalidSlide").and.callFake(function () {
                    return 7
                })
            };
            testSet(testData);
            expect(testData.exceptions.invalidSlide).toHaveBeenCalledWith("invalidSlide");
            expect(_extra.error).not.toHaveBeenCalled();
            expect(dummy).toHaveBeenCalledWith(5);
            expect(dummy).toHaveBeenCalledWith(6);
            expect(dummy).toHaveBeenCalledWith(7);


        });

        it("should report error if we try to mark a slide as correct which is beyond the number of slides in the project", function () {

            _extra.slideManager.numSlides = 100;

            testData.query = 101;
            testSet(testData);
            expect(_extra.error).toHaveBeenCalledWith("CV072", jasmine.anything(), jasmine.anything());
            expect(dummy).not.toHaveBeenCalled();

            _extra.error.calls.reset();

            testData.query = "99-101";
            testData.exceptions = {
                "slideBeyondProject":jasmine.createSpy("exceptions.slideBeyondProject")
            };
            testSet(testData);
            expect(testData.exceptions.slideBeyondProject).toHaveBeenCalledWith(101);
            expect(_extra.error).toHaveBeenCalledWith("CV072", jasmine.anything(), jasmine.anything());
            expect(dummy).toHaveBeenCalledWith(99);
            expect(dummy).toHaveBeenCalledWith(100);

        });
        
    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// MD.SOR_SR
    ///////////////////////////////////////////////////////////////////////
    describe("A test suite for MD.SOR_STR", function () {

        beforeEach(function () {
            testData = {
                "output":dummy
            };
            testSet = _extra.variableManager.parseSets.MP.SOR_STR;
        });

        it("should send the first parameter through SOR and the second through STR", function () {

            testData.query = "slideObject";
            testData.string = "string";
            testSet(testData);

            expect(dummy).toHaveBeenCalledWith("slideObject", "string");

        });

        it("should allow us to hear exceptions to string validation", function () {

            testData.query = "slideObject";
            testData.string = "invalid";
            testData.STR = {
                "validation":{
                    "right":null
                },
                "exceptions":{
                    invalidString: jasmine.createSpy("STR.invalidString")
                }
            };

            testSet(testData);

            expect(testData.STR.exceptions.invalidString).toHaveBeenCalledWith("invalid");
        });

        it("should allow us to hear exceptions to slide object set", function () {

            testData.query = "invalidSlideObject";
            testData.string = "valid";
            testData.SOR = {
                "exceptions":{
                    invalidName: jasmine.createSpy("SOR.invalidName")
                }
            };

            testSet(testData);

            expect(testData.SOR.exceptions.invalidName).toHaveBeenCalledWith("invalidSlideObject");

        });
    });

    describe("A test suite for MD.SOR_EVT_INT_CRI", function () {

        beforeEach(function () {
            testData = {
                "output":dummy
            };
            testSet = _extra.variableManager.parseSets.MP.SOR_EVT_INT_CRI;
        });

        it("should allow us to add an event listener", function () {

            testData.slideObject = "slideObject";
            testData.event = "click";
            testData.interactiveObject = "interactiveObject";
            testData.criteria = "success";
            testSet(testData);

            expect(dummy).toHaveBeenCalledWith("slideObject", "click", "interactiveObject", "success");

        });

        it("should allow us to validate the event and success strings", function () {

            testData.slideObject = "slideObject";
            testData.event = "invalid";
            testData.EVT = {
                "validation":{
                    "valid":null
                },
                "exceptions":{
                    "invalidString":jasmine.createSpy("EVT.exceptions.invalidString")
                }
            };
            testData.interactiveObject = "interactiveObject";
            testData.criteria = "success";
            testSet(testData);

            expect(testData.EVT.exceptions.invalidString).toHaveBeenCalled();

        });

    });
});