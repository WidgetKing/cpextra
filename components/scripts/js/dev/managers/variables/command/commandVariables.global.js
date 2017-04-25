/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 8:14 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("commandVariables_global", ["processCommandVariableRegistration", "localStorageManager", "parameterParseSets"], function () {

    "use strict";

    var SUCCESS_CRITERIA = "success",
        FAILURE_CRITERIA = "failure",
        FOCUS_LOST_CRITERIA = "focuslost",

        parseSets = _extra.variableManager.parseSets,
        handlers = _extra.variableManager.parameterHandlers,

        updateDataTechniques = {
            "parameterToQuery": function(data, query) {
                data.query = query;
            },
            "parametersToQueryString": function (data, query, string) {
                data.query = query;
                data.string = string;
            }
        },


        commandDatas = {

            createBasicSlideObjectData: function (commandName, method) {
                return {
                    "commandName":commandName,
                    "updateData": updateDataTechniques.parameterToQuery,
                    "parseSet": parseSets.SP.CD.SOR,
                    "parseSetData":{
                        "query":undefined, // Changed in the updateData method
                        "output":method
                    }
                };
            },

            createVariableCommandData: function (commandName, method) {
                return {
                    "commandName": commandName,
                    "updateData": updateDataTechniques.parameterToQuery,
                    "parseSet":parseSets.SP.CD.VR,
                    "parseSetData": {
                        "query":undefined, // Changed in the updateData method
                        "output":method
                    }
                };
            },

            createEventListenerObjectData: function (commandName, method) {
                return {
                    "commandName":commandName,
                    "updateData": function (data, slideObject, event, interactiveObject, criteria) {
                        data.slideObject = slideObject;
                        data.event = event;
                        data.interactiveObject = interactiveObject;
                        data.criteria = criteria;
                    },
                    "parameterHandler": handlers.sendParametersAsParameters,
                    "parseSet": parseSets.MP.SOR_EVT_INT_CRI,
                    "parseSetData": {
                        "slideObject":undefined,   // Changed in the updateData method
                        "event":undefined,             // Changed in the updateData method
                        "interactiveObject":undefined, // Changed in the updateData method
                        "criteria":undefined,          // Changed in the updateData method
                        "output":method,
                        "SOR": {
                            "exceptions":{
                                "invalidName":function (slideObject) {
                                    _extra.error("CV030", slideObject, commandName);
                                    return _extra.variableManager.parseSets.SKIP_ERROR;
                                }
                            }
                        },
                        "EVT":{
                            "validation": _extra.eventManager.events,
                            "validationCase":"upper",
                            "exceptions": {
                                "invalidString": function (event) {
                                    _extra.error("CV031", event, commandName);
                                    return _extra.variableManager.parseSets.SKIP_ERROR;
                                }
                            }
                        },
                        "CRI":{
                            "default":SUCCESS_CRITERIA
                        }
                    }
                };
            },

            "createBaseGetterSetterData": function (commandName, getter) {
                return {
                    "commandName":commandName,
                    "updateData": function (data, p1, p2) {
                        data.slideObject = p1;
                        data.number = p2;
                    },
                    "parameterHandler": handlers.sendParametersAsParameters,
                    "parseSet": parseSets.MP.SOR_NR,
                    "parseSetData": {
                        "slideObject":undefined,   // Changed in the updateData method
                        "number":undefined,        // Changed in the updateData method
                        "get":getter,
                        "SOR":{

                        }
                    }
                };
            },

            "createScoreGetterSetterData": function (commandName, getter, setter) {
                var data = commandDatas.createGetterSetterData(commandName, getter, setter);
                data.parseSetData.SOR.requireInteractiveObject = true;
                data.parseSetData.NR.exceptions.NaN = function (string) {

                    string = string.toLowerCase();

                    if (string === "max" ||
                        string === "maximum" ||
                        string === "top" ||
                        string === "full" ||
                        string === "topscore") {

                        return "max";

                    } else if (string === "half") {

                        return "half";

                    } else {

                        return false;

                    }

                };
                return data;
            },

            "createGetterData": function (commandName, getter) {
                var data = commandDatas.createBaseGetterSetterData(commandName, getter);
                data.parseSetData.getOnly = true;
                data.parseSetData.exceptions = {
                    "illegalSet":function (slideObject) {
                        _extra.error("CV006", slideObject, commandName);
                        return _extra.variableManager.parseSets.SKIP_ERROR;
                    }
                };
                return data;
            },

            "createGetterSetterData": function (commandName, getter, setter) {

                var data = commandDatas.createBaseGetterSetterData(commandName, getter);
                data.parseSetData.set = setter;
                data.parseSetData.NR = {
                    "exceptions":{
                        "NaN": function (string) {

                            string = string.toLowerCase();

                            if (string === "default" ||
                                string === "reset" ||
                                string === "original") {

                                return "reset";

                            } else {

                                return false;

                            }

                        }
                    }
                };

                return data;
            }
        };




    _extra.variableManager.processCommandVariableRegistration({


        ///////////////////////////////////////////////////////////////////////
        /////////////// BASIC SLIDE OBJECT COMMAND VARIABLES
        ///////////////////////////////////////////////////////////////////////

        ////////////////////////////////
        ////////// Hide/Show
        "Hide": commandDatas.createBasicSlideObjectData("hide", _extra.slideObjects.hide),

        "Show": commandDatas.createBasicSlideObjectData("show", _extra.slideObjects.show),

        ////////////////////////////////
        ////////// Interaction Enable/Disable
        "Enable": commandDatas.createBasicSlideObjectData("enable", _extra.slideObjects.enable),

        "Disable": commandDatas.createBasicSlideObjectData("disable", _extra.slideObjects.disable),

        ////////////////////////////////
        ////////// Mouse Enable/Disable

        "EnableMouseEvents": commandDatas.createBasicSlideObjectData("enableMouseEvents",
                                                                     _extra.slideObjects.enableForMouse),

        "DisableMouseEvents": commandDatas.createBasicSlideObjectData("disableMouseEvents",
                                                                      _extra.slideObjects.disableForMouse),

        ////////////////////////////////
        ////////// Allow/Prevent Tab Out
        "PreventTabOut": commandDatas.createBasicSlideObjectData("preventTabOut",
                                                                 _extra.focusManager.lockFocusTo),

        "AllowTabOut": commandDatas.createBasicSlideObjectData("allowTabOut",
                                                               _extra.focusManager.unlockFocusFrom),





        ///////////////////////////////////////////////////////////////////////
        /////////////// BASIC VARIABLE COMMAND VARIABLES
        ///////////////////////////////////////////////////////////////////////

        ////////////////////////////////
        ////////// Round
        "Round": commandDatas.createVariableCommandData("round", _extra.variableManager.mathActions.round),
        "Floor": commandDatas.createVariableCommandData("floor", _extra.variableManager.mathActions.floor),
        "Ceil": commandDatas.createVariableCommandData("ceil", _extra.variableManager.mathActions.ceil),
        "RoundTo": {
            "commandName":"roundTo",
            "parameterHandler": handlers.sendParametersAsParameters,
            "updateData": function (data, variableName, number, string) {
                data.variable = variableName;
                data.number = number;
                data.string = string;
            },
            "parseSet": parseSets.MP.VR_NR_STR,
            "parseSetData": {
                "variable": undefined,
                "number": undefined,
                "string": undefined,
                "output": _extra.variableManager.mathActions.roundTo,
                "STR":{
                    "default":"normal",
                    "validation":{
                        "up":"up",
                        "upper":"up",
                        "ceil":"up",

                        "down":"down",
                        "floor":"down",

                        "normal":"normal",
                        "none":"normal",
                        "ordinary":"normal",
                        "null":"normal"
                    }
                }
            }
        },

        ////////////////////////////////
        ////////// Random
        "Random": {
            "commandName": "random",
            "updateData": function (data, variable, upperLimit, lowerLimit) {
                data.variable = variable;
                data.number1 = upperLimit;
                data.number2 = lowerLimit;
            },
            "parameterHandler": handlers.sendParametersAsParameters,
            "parseSet":parseSets.MP.VR_NR1_NR2,
            "parseSetData": {
                "variable": undefined,
                "number1": undefined,
                "number2": undefined,
                "output": _extra.variableManager.mathActions.random,
                "NR1": {
                    "default":1 // Upper limit
                },
                "NR2": {
                    "default":0 // Lower limit
                }
            }
        },

        ////////////////////////////////
        ////////// Reset
        "Reset": {
            "commandName":"reset",
            "updateData": updateDataTechniques.parameterToQuery,
            "parseSet":parseSets.SP.CD.VR,
            "parseSetData": {
                "query":undefined, // Changed in the updateData method
                "output":_extra.variableManager.reset,
                "exceptions":{
                    "invalidName":function (variableName) {
                        _extra.error("CV050", variableName);
                        // Don't report the CV002 error
                        return _extra.variableManager.parseSets.SKIP_ERROR;
                    }
                }
            }
        },


        ////////////////////////////////
        ////////// Flush
        "FlushStorage": {
            "commandName":"flushStorage",
            "updateData": updateDataTechniques.parameterToQuery,
            "parseSet": parseSets.SP.CD.VR,
            "parseSetData": {
                "query":undefined, // Changed in the updateData method
                "output":_extra.variableManager.flushStorage,
                "alternateQueryHandler": _extra.variableManager.enactFunctionOnStorageVariables,
                "exceptions": {
                    "invalidName": function (variableName) {

                        var keyword = variableName.toLowerCase();

                        // Check to see if we have a keyword here
                        if (keyword === "local" || keyword === "session" || keyword === "all") {
                            return keyword;
                        }

                        _extra.error("CV060", variableName);
                        // Don't report the CV002 error
                        return _extra.variableManager.parseSets.SKIP_ERROR;
                    }
                }
            }
        },



        ///////////////////////////////////////////////////////////////////////
        /////////////// BASIC SLIDE COMMAND VARIABLES
        ///////////////////////////////////////////////////////////////////////
        "CompleteSlide":{
            "commandName":"completeSlide",
            "updateData": updateDataTechniques.parameterToQuery,
            "parseSet": parseSets.SP.CD.SLR,
            "parseSetData": {
                "query":undefined, // Changed in the updateData method
                "output":_extra.TOCManager.completeSlide
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        //////////////////// ADVANCED COMMAND VARIABLES (over one parameter)
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////////
        /////////////// Event Listeners
        ///////////////////////////////////////////////////////////////////////
        "AddEventListener": commandDatas.createEventListenerObjectData("addEventListener",
                            function (slideObject, event, interactiveObject, criteria) {
                                _extra.eventManager.addEventListener(slideObject, event, interactiveObject, criteria);
        }),

        "RemoveEventListener": commandDatas.createEventListenerObjectData("removeEventListener",
                            function (slideObject, event, interactiveObject, criteria) {
                                _extra.eventManager.removeEventListener(slideObject, event, interactiveObject, criteria);
        }),

        ///////////////////////////////////////////////////////////////////////
        /////////////// Alert
        ///////////////////////////////////////////////////////////////////////
        "Alert": {
            "commandName":"alert",
            "parseSet":parseSets.MP.STR1_STR2_INT_CRI,
            "parameterHandler": handlers.sendParametersAsParameters,
            "updateData":function (data, string1, string2, interactiveObject, criteria) {

                data.string1 = string1;
                data.string2 = string2;
                data.interactiveObject = interactiveObject;
                data.criteria = criteria;

            },
            "parseSetData":{
                "string1":undefined, // Changed in the updateData method
                "string2":undefined, // Changed in the updateData method
                "interactiveObject":undefined, // Changed in the updateData method
                "criteria":undefined, // Changed in the updateData method
                "STR2":{
                    "default":"CpExtra Alert"
                },
                "INT":{
                    "default":null
                },
                "CRI":{
                    "default":SUCCESS_CRITERIA
                },
                "output":function (message, title, interactiveObject, criteria) {

                    var data = {
                        "message":message,
                        "title":title
                    };

                    // If no interactive object has been set, then we don't need to specify
                    // a firstButtonAction
                    if (interactiveObject) {
                        data.firstButtonAction = function () {
                            _extra.actionManager.callActionOn(interactiveObject, criteria);
                        };
                    }

                    _extra.alertManager.sendAlert(data);

                }
            }
        },


        ///////////////////////////////////////////////////////////////////////
        /////////////// Set/Get Score
        ///////////////////////////////////////////////////////////////////////
        "Score": commandDatas.createScoreGetterSetterData("score",
            function (variableName, slideObjectName) { // Get

                _extra.variableManager.setVariableValue(variableName,
                    _extra.quizManager.getSlideObjectScore(slideObjectName));

            },
            function (slideObjectName, number) { // Set

                _extra.quizManager.setSlideObjectScore(slideObjectName, number);

            }),

        ///////////////////////////////////////////////////////////////////////
        /////////////// MaxScore
        ///////////////////////////////////////////////////////////////////////
        "MaxScore": commandDatas.createGetterData("maxScore", function (variableName, slideObjectName) {

            var slideObject = _extra.quizManager.getSlideObjectQuestionData(slideObjectName);

            if (slideObject) {
                _extra.variableManager.setVariableValue(variableName, slideObject.maxScore);
            }

        }),

        ///////////////////////////////////////////////////////////////////////
        /////////////// X and Y
        ///////////////////////////////////////////////////////////////////////
        "PosX": commandDatas.createGetterSetterData("posX",
            function (variableName, slideObject) { // Get

                _extra.variableManager.setVariableValue(variableName,
                                       _extra.slideObjects.getSlideObjectProperty(slideObject, "x"));

            },
            function (slideObjectName, number) { // Set

                _extra.slideObjects.model.write(slideObjectName, "x", number);

            }),

        "PosY": commandDatas.createGetterSetterData("posY",
            function (variableName, slideObject) { // Get

                _extra.variableManager.setVariableValue(variableName,
                                       _extra.slideObjects.getSlideObjectProperty(slideObject, "y"));

            },
            function (slideObjectName, number) { // Set

                _extra.slideObjects.model.write(slideObjectName, "y", number);

            }),

        ///////////////////////////////////////////////////////////////////////
        /////////////// Width and Height
        ///////////////////////////////////////////////////////////////////////
        "Width": commandDatas.createGetterData("width", function (variableName, slideObject) {

            _extra.variableManager.setVariableValue(variableName,
                _extra.slideObjects.getSlideObjectProperty(slideObject, "width"));

        }),

        "Height": commandDatas.createGetterData("height", function (variableName, slideObject) {

            _extra.variableManager.setVariableValue(variableName,
                _extra.slideObjects.getSlideObjectProperty(slideObject, "height"));

        }),

        ///////////////////////////////////////////////////////////////////////
        /////////////// Slide Objects
        ///////////////////////////////////////////////////////////////////////
        "ChangeState": {
            "commandName":"changeState",
            "updateData":updateDataTechniques.parametersToQueryString,
            "parameterHandler": handlers.sendParametersAsParameters,
            "parseSet": parseSets.MP.SOR_STR,
            "parseSetData":{
                "query":undefined, // Changed in the updateData method
                "string":undefined, //  // Changed in the updateData method
                "output":_extra.slideObjects.states.change
            }
        },


        "SetCursor": {
            "commandName":"setCursor",
            "updateData":updateDataTechniques.parametersToQueryString,
            "parameterHandler": handlers.sendParametersAsParameters,
            "parseSet": parseSets.MP.SOR_STR,
            "parseSetData":{
                "query":undefined, // Changed in the updateData method
                "string":undefined, //  // Changed in the updateData method
                "output":_extra.slideObjects.setCursor,
                "STR": {
                    "exceptions": {
                        "invalidString":function(cursorType) {
                            _extra.error("CV020", cursorType);
                            // Don't report the CV003 error
                            return _extra.variableManager.parseSets.SKIP_ERROR;
                        }
                    },
                    "validation": {
                        "auto":null,
                        "default":null,
                        "none":null,
                        "context-menu":null,
                        "help":null,
                        "pointer":null,
                        "progress":null,
                        "wait":null,
                        "cell":null,
                        "crosshair":null,
                        "text":null,
                        "vertical-text":null,
                        "alias":null,
                        "copy":null,
                        "move":null,
                        "no-drop":null,
                        "not-allowed":null,
                        "all-scroll":null,
                        "col-resize":null,
                        "row-resize":null,
                        "n-resize":null,
                        "e-resize":null,
                        "s-resize":null,
                        "w-resize":null,
                        "ne-resize":null,
                        "nw-resize":null,
                        "se-resize":null,
                        "sw-resize":null,
                        "ew-resize":null,
                        "ns-resize":null,
                        "nesw-resize":null,
                        "nwse-resize":null,
                        "zoom-in":null,
                        "zoom-out":null,
                        "grab":null,
                        "grabbing":null
                    }
                }
            }
        },

        "CallActionOn": {
            "commandName":"callActionOn",
            "updateData":function (data, interactiveObject, criteria) {

                data.interactiveObject = interactiveObject;
                data.criteria = criteria;

            },
            "parameterHandler": handlers.sendParametersAsParameters,
            "parseSet": parseSets.MP.INT_CRI,
            "parseSetData":{
                "query":undefined, // Changed in the updateData method
                "string":undefined, // Changed in the updateData method
                "output":_extra.actionManager.callActionOn,
                "CRI": {
                    "default": SUCCESS_CRITERIA
                }
            }

        }

    });

});