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

                    function canOutputSlide(name) {

                        var slideDetails = _extra.slideManager.getSlideIndexFromName(name);

                        if (slideDetails && slideDetails.slide > -1) {

                            output(slideDetails.slide);
                            return true;

                        }

                        return false;

                    }

                    function manageRange(data) {

                    }

                    var data = _extra.variableManager.parse.string(string);

                    if (data.is$Variable) {

                        data = data.variable;

                    }

                    if (!canOutputSlide(data.value)) {

                        if (data.isVariable) {

                            data = data.variable;

                        }

                        if (data.isNumber) {

                            output(data.value);

                        } else if (data.isQuery) {

                            _extra.slideManager.enactFunctionOnSlides(data.value, function (name) {
                                // Convert name to number and export
                                canOutputSlide(name);
                            });

                        } else if (!canOutputSlide(data.value)) {

                            // Now we're possibly dealing with a range
                            manageRange(data);

                        }

                    }



                },
                // STring Related
                "STR":function (string) {

                    var data = _extra.variableManager.parse.string(string);

                    if (data.isVariable) {
                        return data.variable.value;
                    } else {
                        return data.value;
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
            "SOR_STR": function (query, string, output) {

                string = _extra.variableManager.parseSets.SP.CD.STR(string);

                _extra.variableManager.parseSets.SP.CD.SOR(query, function (slideObject) {
                    output(slideObject, string);
                });
            }
        }

    };

});