/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 14/06/16
 * Time: 11:34 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("parameterParseSets", ["parameterParser", "variableManager"], function () {

    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// Util methods
    ///////////////////////////////////////////////////////////////////////
    var SUCCESS_CRITERIA = "success",
        FAILURE_CRITERIA = "failure",
        FOCUS_LOST_CRITERIA = "focuslost",
        parseSets,
        proceedOrDefault = function (p, parameter, entryPoint) {

            if (p.hasOwnProperty("default")) {

                if (p[parameter] === null || p[parameter] === undefined) {

                    p.output(p.default);
                    return;

                }

            }

            entryPoint();

        },
        initialParsing = function (p, parameter, replaceVariable) {

            if (p.substituteParseResult) {

                p.parseResult = p.substituteParseResult;
                delete p.substituteParseResult;

            } else {

                p.parseResult = _extra.variableManager.parse.string(p[parameter]);

            }

            // REPLACE WITH VARIABLE
            if (replaceVariable && p.parseResult.isVariable) {

                p.parseResult = p.parseResult.variable;

            }

        },

        validateDataBlock = function (p, dataName, currentParameter, dataParameter) {
            if (p[dataName] === undefined) {
                p[dataName] = {};
            }
            p[dataName][dataParameter] = p[currentParameter];
        },

        getSingleParameter = function (dataBlock, parseSet) {
            var result;
            dataBlock.output = function (r) {
                result = r;
            };
            parseSet(dataBlock);
            return result;
        },

        runTestWithFakeOutput = function (dataBlock, parseSet, fakeOutput) {

            var output = dataBlock.output;
            dataBlock.output = fakeOutput;

            parseSet(dataBlock);

            dataBlock.output = output;

        },

        runException = function(p) { // p: Stands for Parameters

        // Have a method to handle this exception
        if (p.data.exceptions && p.data.exceptions.hasOwnProperty(p.exceptionName)) {

            var result = p.data.exceptions[p.exceptionName](p.issue);

            // Don't want to output, but don't want to call error...
            if (result === parseSets.SKIP_ERROR) {

                return;

            // Successfully handled exception
            } else if (result) {

                p.output(result);
                return;

            }

        }

        p.fail();

    };

    _extra.variableManager.parseSets = {

        // This is passed back by exceptions to let the parse set know it shouldn't throw an error
        "SKIP_ERROR":{},

        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        //////////////////// Singular Parameters
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        "SP":{
            "CD":{

                ///////////////////////////////////////////////////////////////////////
                /////////////// Slide Object Related
                ///////////////////////////////////////////////////////////////////////
                ///// Exceptions
                // invalidName
                // illegalQuery
                // nonInteractive
                "SOR":function (p) {

                    function entryPoint () {

                        initialParsing(p, "query", true);

                        if (p.parseResult.isSlideObject) {

                            processSlideObject(p.parseResult.value);

                        } else if (p.parseResult.isQuery) {

                            if (p.noQueries) {

                                runException({
                                    "data":p,
                                    "exceptionName":"illegalQuery",
                                    "issue":p.parseResult.value,
                                    "output":p.output,
                                    "fail": function () {
                                        _extra.error("CV004", p.parseResult.value);
                                    }
                                });

                            } else {

                                _extra.slideObjects.enactFunctionOnSlideObjects(p.parseResult.value,
                                    function (slideObjectName) {
                                        processSlideObject(slideObjectName, true);
                                    });

                            }


                        } else { // Invalid

                            runException({
                                "data":p,
                                "exceptionName":"invalidName",
                                "issue":p.parseResult.value,
                                "output":p.output,
                                "fail": function () {
                                    _extra.error("CV001", p.parseResult.value);
                                }
                            });

                        }

                    }

                    function processSlideObject (slideObjectName, skipException) {

                        // If we require an Interactive Object, then we'll double check it here.
                        if (p.requireInteractiveObject &&
                            !_extra.slideObjects.isInteractiveObject(slideObjectName)) {

                            if (skipException !== true) {

                                runException({
                                    "data":p,
                                    "exceptionName":"nonInteractive",
                                    "issue":slideObjectName,
                                    "output":p.output,
                                    "fail": function () {
                                        _extra.error("CV007", slideObjectName);
                                    }
                                });

                            }

                        } else {

                            // Success!
                            p.output(slideObjectName);

                        }


                    }

                    proceedOrDefault(p, "query", entryPoint);

                },



                ///////////////////////////////////////////////////////////////////////
                /////////////// Variable Related
                ///////////////////////////////////////////////////////////////////////
                ///// Exceptions
                // invalidName
                "VR":function (p) {

                    function entryPoint () {

                        initialParsing(p, "query", false);

                        if (p.parseResult.is$Variable) {

                            p.parseResult = p.parseResult.variable;

                        }

                        if (p.parseResult.isVariable) {

                            p.output(p.parseResult.value);

                        } else if (p.parseResult.isQuery) {

                            if (p.alternateQueryHandler) {

                                // This is mainly here so we can @syntax local and session storage variables
                                p.alternateQueryHandler(p.parseResult.value, p.output);

                            } else {

                                _extra.variableManager.enactFunctionOnVariables(p.parseResult.value, p.output);

                            }

                        } else if (p.parseResult.isNumber) {

                            runError("CV008", "invalidNumber");

                        } else if (p.parseResult.isString) {

                            if (_extra.variableManager.hasVariable(p.parseResult.value)) {

                                p.output(p.parseResult.value);

                            } else {

                                runError("CV002", "invalidName");

                            }

                        } else {

                            runError("CV002", "invalidName");

                        }

                    }

                    function runError (code, name) {

                        runException({
                            "data":p,
                            "exceptionName": name,
                            "issue":p.parseResult.value,
                            "output":p.output,
                            "fail": function () {
                                _extra.error(code, p.parseResult.value);
                            }
                        });

                    }

                    proceedOrDefault(p, "query", entryPoint);

                },


                ///////////////////////////////////////////////////////////////////////
                /////////////// Slide Related
                ///////////////////////////////////////////////////////////////////////
                ///// Exceptions
                // invalidSlide
                // slideBeyondProject
                "SLR":function (p) { // p stands for parameters

                    function entryPoint() {

                        initialParsing(p, "query", false);

                        if (p.parseResult.is$Variable) {

                            p.parseResult = p.parseResult.variable;

                        }

                        if (!canOutputSlide(p.parseResult.value)) {

                            if (p.parseResult.isVariable) {

                                p.parseResult = p.parseResult.variable;

                            }

                            if (p.parseResult.isNumber) {

                                outputSlide(p.parseResult.value);

                            } else if (p.parseResult.isQuery) {

                                _extra.slideManager.enactFunctionOnSlides(p.parseResult.value,
                                                                          function (name) {
                                    // Convert name to number and export
                                    canOutputSlide(name);
                                });

                            } else if (!canOutputSlide(p.parseResult.value)) {

                                // Check if we're dealing with 'all'
                                if (p.parseResult.value.toLowerCase &&
                                    p.parseResult.value.toLowerCase() === "all") {
                                    p.parseResult.value = "1-" + _extra.slideManager.numSlides;
                                }

                                // Now we're possibly dealing with a range
                                manageRange(p.parseResult.value);

                            }

                        }
                    }

                    function canOutputSlide(name) {

                        var slideDetails = _extra.slideManager.getSlideIndexFromName(name);

                        if (slideDetails && slideDetails.slide > -1) {

                            // counter for zero based
                            var slideNumber = slideDetails.slide + 1;

                            if (slideNumber > _extra.slideManager.numSlides) {

                                _extra.error("CV072", slideNumber, _extra.slideManager.numSlides);

                            } else {

                                outputSlide(slideNumber);
                                return true;

                            }

                        }

                        return false;

                    }

                    function manageRange(range) {
                        var rangeComponents = range.split("-");

                        switch (rangeComponents.length) {

                            case 2:

                                // Make sure none of these ranges are empty
                                if (rangeComponents[0] !== "" && rangeComponents[1] !== "") {

                                    applyToRange(rangeComponents[0], rangeComponents[1]);

                                } else {

                                    _extra.error("CV070", range);

                                }


                                break;

                            case 1:
                                // If we're here, we've likely hit an invalid slide name
                                runException({
                                    "data":p,
                                    "exceptionName":"invalidSlide",
                                    "issue":range,
                                    "output":outputSlide,
                                    "fail": function () {
                                        _extra.error("CV071", range);
                                    }
                                });
                                break;

                            default :
                                _extra.error("CV070", range);
                                break;

                        }
                    }

                    function applyToRange (start, end) {

                        start = parseSlideIdentifier(start);
                        end = parseSlideIdentifier(end);

                        if (start === null || end === null) {
                            return;
                        }

                        if (end < start) {
                            var temp = start;
                            start = end;
                            end = temp;
                        }

                        var i = start;

                        while (i <= end) {

                            outputSlide(i);
                            i += 1;

                        }

                    }

                    function parseSlideIdentifier (identifier) {

                        if (_extra.w.isNaN(identifier)) { // Is a slide name

                            var details = _extra.slideManager.getSlideIndexFromName(identifier);

                            if (details) {
                                return details.slide + 1;
                            } else {

                                var result = null;

                                // Not a valid slide name
                                runException({
                                    "data":p,
                                    "exceptionName":"invalidSlide",
                                    "issue":identifier,
                                    "output":function (r) {
                                        result = r;
                                    },
                                    "fail": function () {
                                        _extra.error("CV071", identifier);
                                        result = null;
                                    }
                                });

                                return result;
                            }

                        } else {
                            return _extra.w.parseInt(identifier);
                        }

                    }

                    function outputSlide (slideNumber) {

                        if (slideNumber > _extra.slideManager.numSlides) {

                            runException({
                                "data":p,
                                "exceptionName":"slideBeyondProject",
                                "issue":slideNumber,
                                "output":p.output,
                                "fail": function () {
                                    _extra.error("CV072", slideNumber, _extra.slideManager.numSlides);
                                }
                            });

                        } else {

                            p.output(slideNumber);

                        }

                    }


                    proceedOrDefault(p, "slide", entryPoint);

                },

                ///////////////////////////////////////////////////////////////////////
                /////////////// STRING RELATED
                ///////////////////////////////////////////////////////////////////////
                ///// Exceptions
                // invalidString
                "STR":function (p) {

                    function entryPoint() {

                        var string = getString();

                        if (p.validation) {

                            string = executeValidation(string);

                        }

                        if (string) {

                            p.output(string);

                        }

                    }

                    function getString() {

                        initialParsing(p, "string", true);

                        if (p.parseResult.isNumber) {
                            return p.parseResult.value.toString();
                        }

                        return p.parseResult.value;

                    }

                    function executeValidation (originalString) {

                        var string = capitalize(originalString);
                        var result = p.validation[string];

                        if (result === undefined) {

                            runException({
                                "data":p,
                                "exceptionName":"invalidString",
                                "issue":originalString,
                                "output":function (correctedString) {
                                    result = correctedString;
                                },
                                "fail": function () {
                                    result = null;
                                    _extra.error("CV003", originalString);
                                }
                            });


                        } else {

                            if (p.validation[string] === null) {

                                result = string;

                            }

                        }

                        return result;

                    }

                    function capitalize (string) {

                        switch (p.validationCase) {

                            case "upper" :
                                return string.toUpperCase();

                            case "none" :
                                return string;

                            default :
                                return string.toLowerCase();

                        }

                    }


                    proceedOrDefault(p, "string", entryPoint);

                },

                ///////////////////////////////////////////////////////////////////////
                /////////////// NUMBER RELATED
                ///////////////////////////////////////////////////////////////////////
                ///// Exceptions
                // NaN
                "NR": function (p) {

                    function entryPoint () {

                        initialParsing(p, "number", true);

                        if (p.parseResult.isNumber) {

                            p.output(p.parseResult.value);

                        } else {

                            runException({
                                "data":p,
                                "exceptionName":"NaN",
                                "issue": p.parseResult.value,
                                "output": p.output,
                                "fail": function () {
                                    _extra.error("CV005", p.parseResult.value);
                                }
                            });

                        }

                    }

                    proceedOrDefault(p, "number", entryPoint);

                }
            }
        },


        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        //////////////////// Multiple Parameters
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        "MP":{

            ///////////////////////////////////////////////////////////////////////
            /////////////// Slide Object + String
            ///////////////////////////////////////////////////////////////////////
            "SOR_STR": function (p) {

                function entryPoint () {
                    validateData();
                    var string = getSingleParameter(p.STR, parseSets.SP.CD.STR);
                    // We allow null to get through, as it's possible some command variables may set 'null' as a
                    // default. But no command variable will set 'undefined' as a default.
                    if (string !== undefined) {
                        applyToSlideObjects(string);
                    }
                }

                function validateData () {
                    validateDataBlock(p, "STR", "string", "string");
                    validateDataBlock(p, "SOR", "query", "query");
                }

                function applyToSlideObjects (string) {

                    p.SOR.output = function (slideObject) {

                        p.output(slideObject, string);

                    };

                    parseSets.SP.CD.SOR(p.SOR);

                }

                entryPoint();


            },

            ///////////////////////////////////////////////////////////////////////
            /////////////// Slide Object + Slide Object
            ///////////////////////////////////////////////////////////////////////
            "SOR1_SOR2": function (p) {

                function entryPoint () {

                    validateData();

                    var slideObjects1 = getArrayOfResults(p.SOR1),
                        slideObjects2 = getArrayOfResults(p.SOR2);

                    applyToSlideObjects(slideObjects1, slideObjects2);

                }

                function validateData () {
                    validateDataBlock(p, "SOR1", "slideObject1", "query");
                    validateDataBlock(p, "SOR2", "slideObject2", "query");
                }

                function getArrayOfResults(testSet) {

                    var a = [];

                    testSet.output = function (slideObject) {
                        a.push(slideObject);
                    };

                    parseSets.SP.CD.SOR(testSet);

                    return a;
                }

                function applyToSlideObjects (set1, set2) {

                    for (var i = 0; i < set1.length; i += 1) {
                        var slideObject1 = set1[i];

                        for (var j = 0; j < set2.length; j += 1) {
                            var slideObject2 = set2[j];

                            p.output(slideObject1, slideObject2);

                        }

                    }

                }



                entryPoint();

            },

            ///////////////////////////////////////////////////////////////////////
            /////////////// Slide Object + Slide Object + Number
            ///////////////////////////////////////////////////////////////////////
            "SOR1_SOR2_NR": function (p) {

                function entryPoint () {
                    validateDataBlock(p, "NR", "number", "number");

                    var number = getSingleParameter(p.NR, parseSets.SP.CD.NR);

                    sendNumberToOutput(number);
                }

                function sendNumberToOutput (number) {

                    var output = p.output;

                    p.output = function (slideObject1, slideObject2) {
                        output(slideObject1, slideObject2, number);
                    };

                    parseSets.MP.SOR1_SOR2(p);

                }

                entryPoint();
            },

            ///////////////////////////////////////////////////////////////////////
            /////////////// Interactive Object + Criteria
            ///////////////////////////////////////////////////////////////////////
            "INT_CRI": function (p) {

                var newData = {};

                function entryPoint () {

                    validateData();
                    parseSets.MP.SOR_STR(newData);

                }

                function validateData () {

                    newData.query = p.interactiveObject;
                    newData.string = p.criteria;
                    newData.output = p.output;

                    validateINT();
                    validateSTR();

                }

                function validateINT () {

                    validateDataBlock(p, "INT", "interactiveObject", "query");
                    p.INT.noQueries = true;
                    p.INT.requireInteractiveObject = true;
                    newData.SOR = p.INT;

                }

                function validateSTR () {

                    validateDataBlock(p, "CRI", "criteria", "string");
                    p.CRI.validation = {
                        "1":SUCCESS_CRITERIA,
                        "true":SUCCESS_CRITERIA,
                        "correct":SUCCESS_CRITERIA,
                        "success":SUCCESS_CRITERIA,

                        "0":FAILURE_CRITERIA,
                        "false":FAILURE_CRITERIA,
                        "fail":FAILURE_CRITERIA,
                        "failure":FAILURE_CRITERIA,
                        "lastattempt":FAILURE_CRITERIA,
                        "last":FAILURE_CRITERIA,
                        "last_attempt":FAILURE_CRITERIA,

                        "focus":FOCUS_LOST_CRITERIA,
                        "focuslost":FOCUS_LOST_CRITERIA,
                        "focus_lost":FOCUS_LOST_CRITERIA
                    };

                    if (!p.CRI.exceptions) {
                        p.CRI.exceptions = {};
                    }

                    if (!p.CRI.exceptions.invalidString) {
                        p.CRI.exceptions.invalidString = function(criteria) {
                            _extra.error("CV010", criteria);
                            // Don't report the CV003 error
                            return _extra.variableManager.parseSets.SKIP_ERROR;
                        };
                    }


                    newData.STR = p.CRI;

                }

                entryPoint();

            },

            ///////////////////////////////////////////////////////////////////////
            /////////////// String + String + Interactive Object + Criteria
            ///////////////////////////////////////////////////////////////////////
            "STR1_STR2_INT_CRI": function (p) {

                var result = {
                    "string1": undefined,
                    "string2": undefined,
                    "interactiveObject": undefined,
                    "criteria": undefined
                };

                function entryPoint () {

                    validateData();
                    result.string1 = getSingleParameter(p.STR1, parseSets.SP.CD.STR);
                    result.string2 = getSingleParameter(p.STR2, parseSets.SP.CD.STR);

                    if (result.string1 !== undefined && result.string2 !== undefined) {

                        getActionData();

                    }

                }

                function validateData () {

                    validateDataBlock(p, "STR1", "string1", "string");
                    validateDataBlock(p, "STR2", "string2", "string");

                }

                function getActionData () {

                    var output = p.output;
                    runTestWithFakeOutput(p, parseSets.MP.INT_CRI, function (interactiveObject, criteria) {
                        output(result.string1, result.string2, interactiveObject, criteria);
                    });

                }

                entryPoint();

            },

            ///////////////////////////////////////////////////////////////////////
            /////////////// Event Listener
            ///////////////////////////////////////////////////////////////////////
            "SOR_EVT_INT_CRI": function (p) {

                var result = {
                    "slideObject":null,
                    "event":null,
                    "interactiveObject":null,
                    "criteria":null
                };

                function entryPoint () {

                    validateData();
                    parseAction();

                    if (result.criteria && result.interactiveObject) {
                        parseEventAndSlideObject();
                    }
                }

                function validateData () {

                    var datas = ["SOR","EVT","INT","CRI"],
                        dataName;

                    for (var i = 0; i < datas.length; i += 1) {

                        dataName = datas[i];
                        if (!p.hasOwnProperty(dataName)) {
                            p[dataName] = {};
                        }

                    }
                }

                function parseAction () {

                    runTestWithFakeOutput(p, parseSets.MP.INT_CRI, function (interactiveObject, criteria) {
                        result.interactiveObject = interactiveObject;
                        result.criteria = criteria;
                    });

                }

                function parseEventAndSlideObject () {

                    var data = {
                        "query": p.slideObject,
                        "string": p.event,
                        "STR": p.EVT,
                        "SOR": p.SOR,
                        "output": function (slideObject, event) {
                            p.output(slideObject, event, result.interactiveObject, result.criteria);
                        }
                    };

                    parseSets.MP.SOR_STR(data);

                }

                entryPoint();

            },



            ///////////////////////////////////////////////////////////////////////
            /////////////// Variable + Number
            ///////////////////////////////////////////////////////////////////////

            "VR_NR": function (p) {

                function entryPoint () {

                    validateData();

                    var number = getSingleParameter(p.NR, parseSets.SP.CD.NR);

                    if (!_extra.w.isNaN(number)) {
                        applyToVariables(number);
                    }

                }

                function applyToVariables (number) {

                    p.VR.output = function (variableName) {
                        p.output(variableName, number);
                    };
                    parseSets.SP.CD.VR(p.VR);

                }

                function validateData () {

                    validateDataBlock(p, "VR", "variable", "query");
                    validateDataBlock(p, "NR", "number", "number");

                }

                entryPoint();

            },

            ///////////////////////////////////////////////////////////////////////
            /////////////// Variable + Number + Number
            ///////////////////////////////////////////////////////////////////////
            "VR_NR1_NR2": function (p) {

                function entryPoint () {

                    validateData();

                    var number = getSingleParameter(p.NR2, parseSets.SP.CD.NR);

                    if (!_extra.w.isNaN(number)) {

                        applyToVariables(number);

                    }

                }

                function validateData () {
                    validateDataBlock(p, "NR2", "number2", "number");
                }

                function applyToVariables (number2) {

                    p.NR = p.NR1;
                    p.number = p.number1;

                    var output = p.output;
                    runTestWithFakeOutput(p, parseSets.MP.VR_NR, function (variableName, number1) {
                        output(variableName, number1, number2);
                    });

                    delete p.NR;
                    delete p.number;

                }

                entryPoint();



            },

            ///////////////////////////////////////////////////////////////////////
            /////////////// Variable + Number + String
            ///////////////////////////////////////////////////////////////////////
            "VR_NR_STR": function (p) {

                function entryPoint () {

                    validateDataBlock(p, "STR", "string", "string");
                    var string = getSingleParameter(p.STR, parseSets.SP.CD.STR);
                    if (string) {
                        applyToVariables(string);
                    }

                }

                function applyToVariables (string) {

                    var output = p.output;
                    runTestWithFakeOutput(p, parseSets.MP.VR_NR, function (variableName, number) {
                        output(variableName, number, string);
                    });

                }

                entryPoint();

            },

            ///////////////////////////////////////////////////////////////////////
            /////////////// GETTER/SETTER
            ///////////////////////////////////////////////////////////////////////
            //// Exceptions
            // illegalSet
            "SOR_NR": function (p) {

                var p1 = _extra.variableManager.parse.string(p.slideObject),
                    p2 = _extra.variableManager.parse.string(p.number);

                function entryPoint () {

                    setUpData();

                    if (isGetter()) {

                        handleGet();

                    } else { // is setter

                        if (p.getOnly) {

                            handleIllegalSet();

                        } else {

                            handleSet();

                        }

                    }

                }

                function setUpData () {

                    validateDataBlock(p, "SOR", "slideObject", "query");
                    p.SOR.substituteParseResult = p1;

                    validateDataBlock(p, "NR", "number", "number");
                    p.NR.substituteParseResult = p2;

                }

                function isGetter () {

                    // Variable | Slide Object
                    // Variable@Syntax | SlideObject
                    if (p2.isSlideObject || (p2.isVariable && p2.variable.isSlideObject)) {

                        if (p1.isVariable || p1.isQuery) {

                            return true;

                        }

                    }

                    return false;

                }

                function handleGet () {

                    var slideObject = null;

                    p.NR.output = function (n) {
                        slideObject = n;
                    };
                    p.NR.noQueries = true;

                    parseSets.SP.CD.SOR(p.NR);

                    if (slideObject !== null) {

                        p.SOR.output = function (variableName) {

                            p.get(variableName, slideObject);

                        };

                        parseSets.SP.CD.VR(p.SOR);

                    }

                }

                function handleSet () {

                    var number = null;

                    p.NR.output = function (n) {
                        number = n;
                    };

                    parseSets.SP.CD.NR(p.NR);

                    if (number !== null) {

                        p.SOR.output = function (slideObjectName) {

                            p.set(slideObjectName, number);

                        };

                        parseSets.SP.CD.SOR(p.SOR);

                    }

                }

                function handleIllegalSet () {

                    // Get accurate slide object name (for use in error message)
                    var slideObject = p1;
                    if (slideObject.isVariable) {
                        slideObject = slideObject.variable;
                    }
                    slideObject = slideObject.value;

                    runException({
                        "data":p,
                        "exceptionName":"illegalSet",
                        "issue": slideObject,
                        "output": null,
                        "fail": function () {

                            _extra.error("CV006", slideObject, "<i>unknown</i>");

                        }
                    });

                }

                entryPoint();

            }
        }

    };

    parseSets = _extra.variableManager.parseSets;

});
