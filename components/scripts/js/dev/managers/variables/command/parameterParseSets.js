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
    var initialParsing = function (p, parameter, replaceVariable) {

            if (p.substituteParseResult) {

                p.parseResult = p.substituteParseResult;
                delete p.substituteParseResult;

            } else {

                p.parseResult = _extra.variableManager.parse.string(p[parameter]);

            }

            if (replaceVariable && p.parseResult.isVariable) {

                p.parseResult = p.parseResult.variable;

            }

        },



        runException = function(p) { // p: Stands for Parameters

        // Have a method to handle this exception
        if (p.data.exceptions && p.data.exceptions.hasOwnProperty(p.exceptionName)) {

            var result = p.data.exceptions[p.exceptionName](p.issue);

            // Don't want to output, but don't want to call error...
            if (result === _extra.variableManager.parseSets.SKIP_ERROR) {

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

                    entryPoint();

                },



                ///////////////////////////////////////////////////////////////////////
                /////////////// Variable Related
                ///////////////////////////////////////////////////////////////////////
                ///// Exceptions
                // invalidName
                "VR":function (p) {

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

                    } else {

                        runException({
                            "data":p,
                            "exceptionName":"invalidName",
                            "issue":p.parseResult.value,
                            "output":p.output,
                            "fail": function () {
                                _extra.error("CV002", p.parseResult.value);
                            }
                        });

                    }

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



                    entryPoint();



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


                    entryPoint();

                },

                ///////////////////////////////////////////////////////////////////////
                /////////////// NUMBER RELATED
                ///////////////////////////////////////////////////////////////////////
                ///// Exceptions
                // NaN
                "NR": function (p) {

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
            }
        },


        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        //////////////////// Multiple Parameters
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        "MP":{
            "SOR_STR": function (p) {

                var string;

                if (!p.STR) {
                    p.STR = {};
                }

                p.STR.string = p.string;
                p.STR.output = function (result) {
                    string = result;
                };

                _extra.variableManager.parseSets.SP.CD.STR(p.STR);

                if (string) {

                    if (!p.SOR) {
                        p.SOR = {};
                    }

                    p.SOR.query = p.query;
                    p.SOR.output = function (slideObject) {
                        p.output(slideObject, string);
                    };

                    _extra.variableManager.parseSets.SP.CD.SOR(p.SOR);

                }
            },

            "SOR_EVT_INT_CRI": function (p) {

                var result = {
                    "slideObject":null,
                    "event":null,
                    "interactiveObject":null,
                    "criteria":null
                };

                function entryPoint () {

                    ensureDataObjects();
                    parseCriteria();
                    parseInteractiveObject();

                    if (result.criteria && result.interactiveObject) {
                        parseEventAndSlideObject();
                    }
                }

                function ensureDataObjects () {

                    var datas = ["SOR","EVT","INT","CRI"],
                        dataName;

                    for (var i = 0; i < datas.length; i += 1) {

                        dataName = datas[i];
                        if (!p.hasOwnProperty(dataName)) {
                            p[dataName] = {};
                        }

                    }
                }

                function parseCriteria () {
                    p.CRI.string = p.criteria;
                    p.CRI.output = function (string) {
                        result.criteria = string;
                    };
                    _extra.variableManager.parseSets.SP.CD.STR(p.CRI);
                }

                function parseInteractiveObject () {
                    p.INT.query = p.interactiveObject;
                    p.INT.noQueries = true;
                    p.INT.requireInteractiveObject = true;
                    p.INT.output = function (interactiveObject) {
                        result.interactiveObject = interactiveObject;
                    };
                    _extra.variableManager.parseSets.SP.CD.SOR(p.INT);
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

                    _extra.variableManager.parseSets.MP.SOR_STR(data);

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

                    if (!p.SOR) {
                        p.SOR = {};
                    }
                    p.SOR.substituteParseResult = p1;
                    p.SOR.query = p.slideObject;

                    if (!p.NR) {
                        p.NR = {};
                    }
                    p.NR.substituteParseResult = p2;
                    p.NR.number = p.number;

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

                    _extra.variableManager.parseSets.SP.CD.SOR(p.NR);

                    if (slideObject !== null) {

                        p.SOR.output = function (variableName) {

                            p.get(variableName, slideObject);

                        };

                        _extra.variableManager.parseSets.SP.CD.VR(p.SOR);

                    }

                }

                function handleSet () {

                    var number = null;

                    p.NR.output = function (n) {
                        number = n;
                    };

                    _extra.variableManager.parseSets.SP.CD.NR(p.NR);

                    if (number !== null) {

                        p.SOR.output = function (slideObjectName) {

                            p.set(slideObjectName, number);

                        };

                        _extra.variableManager.parseSets.SP.CD.SOR(p.SOR);

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

});