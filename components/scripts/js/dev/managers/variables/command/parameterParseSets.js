/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 14/06/16
 * Time: 11:34 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("parameterParseSets", ["parameterParser", "variableManager"], function () {

    "use strict";

    _extra.variableManager.parseSets = {

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
                "SOR":function (query, output) {

                    function processData(data) {

                        if (data.isSlideObject) {

                            output(data.value);

                        } else if (data.isQuery) {

                            _extra.slideObjects.enactFunctionOnSlideObjects(data.value, output);

                        } else { // Invalid

                            _extra.error("CV001", data.value);

                        }

                    }

                    var data = _extra.variableManager.parse.string(query);

                    if (data.isVariable) {
                        processData(data.variable);
                    } else {
                        processData(data);
                    }


                },
                // Variable Related
                "VR":function (query, output, backup) {

                    var data = _extra.variableManager.parse.string(query);

                    if (data.is$Variable) {

                        data = data.variable;

                    }

                    if (data.isVariable) {

                        output(data.value);

                    } else if (data.isQuery) {

                        _extra.variableManager.enactFunctionOnVariables(data.value, output);

                    } else if (backup) {

                        backup(data.value, output);

                    }

                },
                // SLide Related
                "SLR":function (string, output) {

                    function initialParsing() {

                        var data = _extra.variableManager.parse.string(string);

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
                                _extra.error("CV071", range);
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
                                // Not a valid slide name
                                _extra.error("CV071", identifier);
                                return null;
                            }

                        } else {
                            return _extra.w.parseInt(identifier);
                        }

                    }

                    function outputSlide (slideNumber) {

                        if (slideNumber > _extra.slideManager.numSlides) {

                            _extra.error("CV072", slideNumber, _extra.slideManager.numSlides);

                        } else {

                            output(slideNumber);

                        }

                    }



                    initialParsing();



                },
                // STring Related
                "STR":function (string, validation, exception) {

                    function getString(string) {

                        var data = _extra.variableManager.parse.string(string);

                        if (data.isVariable) {
                            return data.variable.value;
                        } else {
                            return data.value;
                        }

                    }

                    function executeValidation (originalString) {

                        var string = originalString.toLowerCase();
                        var result = validation[string];

                        if (result === undefined) {

                            exception(originalString);


                        } else {

                            if (validation[string] !== null) {

                                return validation[string];

                            } else {

                                return string;

                            }

                        }

                        return null;

                    }



                    // Entry point
                    string = getString(string);

                    if (validation) {
                        string = executeValidation(string);
                    }

                    return string;

                }
            }
        },


        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        //////////////////// Multiple Parameters
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        "MP":{
            "SOR_STR": function (query, string, output) {

                string = _extra.variableManager.parseSets.SP.CD.STR(string);

                _extra.variableManager.parseSets.SP.CD.SOR(query, function (slideObject) {
                    output(slideObject, string);
                });
            }
        }

    };

});