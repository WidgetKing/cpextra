/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 14/06/16
 * Time: 11:34 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("parameterParseSets", ["parameterParser", "variableManager"], function () {

    "use strict";

    var runException = function(p) { // p: Stands for Parameters

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
                "SOR":function (p) {

                    function entryPoint () {

                        var queryData = _extra.variableManager.parse.string(p.query);

                        if (queryData.isVariable) {
                            processData(queryData.variable);
                        } else {
                            processData(queryData);
                        }

                    }

                    function processData(queryData) {

                        if (queryData.isSlideObject) {

                            p.output(queryData.value);

                        } else if (queryData.isQuery) {

                            if (p.noQueries) {

                                runException({
                                    "data":p,
                                    "exceptionName":"illegalQuery",
                                    "issue":queryData.value,
                                    "output":p.output,
                                    "fail": function () {
                                        _extra.error("CV004", queryData.value);
                                    }
                                });

                            } else {

                                _extra.slideObjects.enactFunctionOnSlideObjects(queryData.value, p.output);

                            }


                        } else { // Invalid

                            runException({
                                "data":p,
                                "exceptionName":"invalidName",
                                "issue":queryData.value,
                                "output":p.output,
                                "fail": function () {
                                    _extra.error("CV001", queryData.value);
                                }
                            });

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

                    var queryData = _extra.variableManager.parse.string(p.query);

                    if (queryData.is$Variable) {

                        queryData = queryData.variable;

                    }

                    if (queryData.isVariable) {

                        p.output(queryData.value);

                    } else if (queryData.isQuery) {

                        if (p.alternateQueryHandler) {

                            // This is mainly here so we can @syntax local and session storage variables
                            p.alternateQueryHandler(queryData.value, p.output);

                        } else {

                            _extra.variableManager.enactFunctionOnVariables(queryData.value, p.output);

                        }

                    } else {

                        runException({
                            "data":p,
                            "exceptionName":"invalidName",
                            "issue":queryData.value,
                            "output":p.output,
                            "fail": function () {
                                _extra.error("CV002", queryData.value);
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

                        var data = _extra.variableManager.parse.string(p.query);

                        if (data.is$Variable) {

                            data = data.variable;

                        }

                        if (!canOutputSlide(data.value)) {

                            if (data.isVariable) {

                                data = data.variable;

                            }

                            if (data.isNumber) {

                                outputSlide(data.value);

                            } else if (data.isQuery) {

                                _extra.slideManager.enactFunctionOnSlides(data.value, function (name) {
                                    // Convert name to number and export
                                    canOutputSlide(name);
                                });

                            } else if (!canOutputSlide(data.value)) {

                                // Check if we're dealing with 'all'
                                if (data.value.toLowerCase && data.value.toLowerCase() === "all") {
                                    data.value = "1-" + _extra.slideManager.numSlides;
                                }

                                // Now we're possibly dealing with a range
                                manageRange(data.value);

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

                        var string = getString(p.string);

                        if (p.validation) {
                            string = executeValidation(string);
                        }

                        if (string) {

                            p.output(string);

                        }

                    }

                    function getString(string) {

                        var data = _extra.variableManager.parse.string(string);

                        if (data.isVariable) {
                            data = data.variable;
                        }

                        if (data.isNumber) {
                            return data.value.toString();
                        }

                        return data.value;

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
                                    result = correctedString
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
                                return string

                            default :
                                return string.toLowerCase();

                        }

                    }


                    entryPoint();

                }
            }
        },


        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        //////////////////// Multiple Parameters
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        "MP":{
            "SOR_STR": function (p) { //query, string, output) {

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

                    _extra.variableManager.parseSets.MP.SOR_STR(data)

                }




                entryPoint();

            }
        }

    };

});