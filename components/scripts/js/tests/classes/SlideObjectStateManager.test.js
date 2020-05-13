/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 26/10/15
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for testing the SlideObjectStateManager class", function () {
    "use strict";

    function create(slideObjectProxy, details) {
        return new unitTests.classes.SlideObjectStateManager(slideObjectProxy, details);
    }

    beforeEach(function () {

        var slideObjectEventListeners = {},
            documentEventListeners = {},
            variableChangeListeners = {},
            parameterParser = unitTests.getModule("parameterParser"),
            slideObjectName = "foobar";

        this.slideObject = {
            "name":slideObjectName,
            "state":"Normal",
            "hasEventListener": function (eventName, callback) {
                if (slideObjectEventListeners[eventName]) {

                    // We are looking for a specific callback
                    if (callback) {

                        return slideObjectEventListeners[eventName] === callback;

                    // We just want to know if something has been registered for this event
                    } else {
                        return true;
                    }

                }
                return false;
            },
            "addEventListener": function (eventName, callback) {
                slideObjectEventListeners[eventName] = callback;
            },
            "removeEventListener": function (eventName, callback) {
                delete slideObjectEventListeners[eventName];
            },
            "dispatchEvent":function (eventName) {
                if (slideObjectEventListeners[eventName]) {
                    slideObjectEventListeners[eventName]();
                }
            },
            "changeState":function (stateName) {
                this.state = stateName;
                _extra.slideObjects.states.changeCallback.sendToCallback(slideObjectName, {
                    "slideObjectName":slideObjectName,
                    "stateName":stateName
                });
            }
        };


        var variables = {
            "trueVariable":true,
            "falseVariable":false,
            "stringVariable":"string",
            "testVar1":null,
            "testVar2":null
        };

        window._extra = {
            "log":jasmine.createSpy("_extra.log"),
            "w":{
                "document":{
                    "hasEventListener": function (eventName, callback) {
                        if (documentEventListeners[eventName]) {

                            // We are looking for a specific callback
                            if (callback) {

                                return documentEventListeners[eventName] === callback;

                            // We just want to know if something has been registered for this event
                            } else {
                                return true;
                            }

                        }
                        return false;
                    },
                    "addEventListener": function (eventName, callback) {
                        documentEventListeners[eventName] = callback;
                    },
                    "removeEventListener": function (eventName, callback) {
                        delete documentEventListeners[eventName];
                    },
                    "dispatchEvent":function (eventName) {
                        if (documentEventListeners[eventName]) {
                            documentEventListeners[eventName]();
                        }
                    }
                },
                "parseFloat":parseFloat,
                "isNaN":isNaN
            },
            "captivate":{
                "projectContainer":document.createElement("DIV")
            },
            "variableManager": {
                "setVariableValue":function (variableName, value) {
                    variables[variableName] = value;
                    variableChangeListeners[variableName]();
                },
                "getVariableValue":function (variableName) {
                    return variables[variableName];
                },
                "listenForVariableChange":function (variableName,callback) {
                    variableChangeListeners[variableName] = callback;
                }
            },
            "slideObjects":{
                "states":{
                    "changeCallback":new unitTests.classes.Callback()
                }
            },
            "eventManager":{
                "events":{
                    "MOUSE_DOWN": "mousedown",
                    "MOUSE_UP": "mouseup",
                    "MOUSE_MOVE": "mousemove",
                    "MOUSE_OVER": "mouseover",
                    "MOUSE_OUT": "mouseout",
                    "ROLLOVER": "mouseover",
                    "ROLLOUT": "mouseout",
                    "RIGHT_CLICK": "rightclick",
                    "CLICK": "click",
                    "DOUBLE_CLICK": "dbl_click"
                }
            },
            "debugging": {
                "debug": jasmine.createSpy("_extra.debugging.debug")
            }
        };

        parameterParser();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should listen for mouse down when presented with mouse down data", function () {

        create(this.slideObject, {
            "d":{
                "x_down":null
            },
            "r": {
                "x_over":null
            }
        });

        expect(this.slideObject.hasEventListener("mousedown")).toBe(true);
        expect(this.slideObject.hasEventListener("mouseover")).toBe(true);

    });

    it("should change states when rolled over and moused down on", function () {

        spyOn(this.slideObject, "changeState");

        create(this.slideObject, {
            "d":{
                "x_down":null
            },
            "r":{
                "x_over":null
            }
        });

        this.slideObject.dispatchEvent("mouseover");
        expect(this.slideObject.changeState).toHaveBeenCalledWith("x_over");

        this.slideObject.dispatchEvent("mousedown");
        expect(this.slideObject.changeState).toHaveBeenCalledWith("x_down");

        // Now roll out.
        this.slideObject.changeState.calls.reset();
        _extra.w.document.dispatchEvent("mouseup");
        expect(this.slideObject.changeState).toHaveBeenCalledWith("x_over");

        this.slideObject.dispatchEvent("mouseout");
        expect(this.slideObject.changeState).toHaveBeenCalledWith("Normal");
    });




    it("should check variable validity of states", function () {
        create(this.slideObject, {
            "n":{
                "x_firstState":{
                    "trueVariable":true,
                    "stringVariable":"string"
                },
                "x_secondState":{
                    "trueVariable":false
                },
                "x_thirdState":{
                    "trueVariable":5
                }
            }
        });

        expect(this.slideObject.state).toBe("x_firstState");

        _extra.variableManager.setVariableValue("trueVariable",0);
        expect(this.slideObject.state).toBe("x_secondState");

        _extra.variableManager.setVariableValue("trueVariable", 5);
        expect(this.slideObject.state).toBe("x_thirdState");

        _extra.variableManager.setVariableValue("trueVariable", null);
        expect(this.slideObject.state).toBe("Normal");

    });

    it("should correctly evaluate variable values with modifiers", function () {

        create(this.slideObject, {
            "n":{
                "x_firstState":{
                    "trueVariable":{
                        "value":"foobar",
                        "modifier":"!"
                    }
                },
                "x_secondState":{
                    "testVar1":{
                        "value":4,
                        "modifier":">"
                    }
                },
                "x_thirdState":{
                    "testVar2":{
                        "value":4,
                        "modifier":"<"
                    }
                }
            }
        });

        expect(this.slideObject.state).toBe("x_firstState");

        _extra.variableManager.setVariableValue("trueVariable","foobar");
        expect(this.slideObject.state).toBe("Normal");

        _extra.variableManager.setVariableValue("testVar1", 5);
        expect(this.slideObject.state).toBe("x_secondState");

        _extra.variableManager.setVariableValue("testVar1",4);
        expect(this.slideObject.state).toBe("Normal");

        _extra.variableManager.setVariableValue("testVar2", 3);
        expect(this.slideObject.state).toBe("x_thirdState");

        _extra.variableManager.setVariableValue("testVar2",4);
        expect(this.slideObject.state).toBe("Normal");

    });

    it("should identify native captivate 'RollOver' or 'Down' states as 'Managed States'.", function () {

        create(this.slideObject, {
            "n":{
                "x_firstState":{
                    "trueVariable":false
                }/*,
                "x_secondState":{
                    "trueVariable":false
                },
                "x_thirdState":{
                    "trueVariable":5
                }*/
            }
        });

        expect(this.slideObject.state).toBe("Normal");

        this.slideObject.changeState("RollOver");
        this.slideObject.changeState("Down");

        _extra.variableManager.setVariableValue("trueVariable", false);
        expect(this.slideObject.state).toBe("x_firstState");

        this.slideObject.changeState("RollOver");
        this.slideObject.changeState("Down");

        _extra.variableManager.setVariableValue("trueVariable", true);
        expect(this.slideObject.state).toBe("Normal");

    });

    it("should correctly evaluate variables with <= and >= modifiers", function () {

        create(this.slideObject, {
            "n":{
                "x_firstState":{
                    "testVar1":{
                        "value":4,
                        "modifier":">="
                    }
                },
                "x_secondState":{
                    "testVar2":{
                        "value":4,
                        "modifier":"<="
                    }
                }
            }
        });

        expect(this.slideObject.state).toBe("Normal");

        _extra.variableManager.setVariableValue("testVar1", 4);
        expect(this.slideObject.state).toBe("x_firstState");

        _extra.variableManager.setVariableValue("testVar1",3);
        expect(this.slideObject.state).toBe("Normal");

        _extra.variableManager.setVariableValue("testVar2", 4);
        expect(this.slideObject.state).toBe("x_secondState");

        _extra.variableManager.setVariableValue("testVar2",5);
        expect(this.slideObject.state).toBe("Normal");

    });

    it("should treat variable data with null values as trues", function () {

        create(this.slideObject, {
            "n":{
                "x_falseVariable":{
                    "falseVariable":null
                }
            }
        });

        expect(this.slideObject.state).toBe("Normal");

        _extra.variableManager.setVariableValue("falseVariable", true);
        expect(this.slideObject.state).toBe("x_falseVariable");

    });

    it("should be able to parse 'TRUE' as equal to 1", function () {

        create(this.slideObject, {
            "n": {
                "x_falseVariable":{
                    "falseVariable":1
                }
            }
        });

        expect(this.slideObject.state).toBe("Normal");

        _extra.variableManager.setVariableValue("falseVariable", "TRUE");
        expect(this.slideObject.state).toBe("x_falseVariable");

    });

    it("should avoid unexpected boolean coercions", function () {

        create(this.slideObject, {
            "n":{
                "x_firstState":{
                    "testVar1":false
                },
                "x_secondState":{
                    "testVar2":0
                }
            }
        });


        _extra.variableManager.setVariableValue("testVar1",true);
        _extra.variableManager.setVariableValue("testVar2",true);
        expect(this.slideObject.state).toBe("Normal");

        _extra.variableManager.setVariableValue("testVar1","false");
        expect(this.slideObject.state).toBe("x_firstState");

        _extra.variableManager.setVariableValue("testVar1","true");
        _extra.variableManager.setVariableValue("testVar2", "0");
        expect(this.slideObject.state).toBe("x_secondState");

        _extra.variableManager.setVariableValue("testVar2", "1");
        expect(this.slideObject.state).toBe("Normal");

        _extra.variableManager.setVariableValue("testVar1", "0");
        expect(this.slideObject.state).toBe("x_firstState");

        _extra.variableManager.setVariableValue("testVar1", "");
        expect(this.slideObject.state).toBe("x_firstState");

    });

    it("should jump back to the last manually set state when no other states are valid", function () {

        create(this.slideObject, {
            "r":{
                "x_over":null
            }
        });

        this.slideObject.changeState("NotNormal");
        spyOn(this.slideObject, "changeState");
        this.slideObject.dispatchEvent("mouseover");
        this.slideObject.dispatchEvent("mouseout");
        expect(this.slideObject.changeState).not.toHaveBeenCalledWith("Normal");
        expect(this.slideObject.changeState).toHaveBeenCalledWith("NotNormal");

    });

    it("should detect if the default state is NOT the 'Normal' state", function () {
        this.slideObject.state = "NotNormal";
        spyOn(this.slideObject, "changeState");
        create(this.slideObject, {
            "r":{
                "x_over":null
            }
        });

        expect(this.slideObject.changeState).toHaveBeenCalledWith("NotNormal");
    });



    it("should unload all event listeners", function () {

        var manager = create(this.slideObject, {
            "r":{
                "x_over":null
            },
            "d":{
                "x_down":null
            }
        });

        manager.unload();

        expect(this.slideObject.hasEventListener("mouseover")).toBe(false);
        expect(this.slideObject.hasEventListener("mousedown")).toBe(false);

        expect(_extra.slideObjects.states.changeCallback.hasCallbackFor("foobar")).toBe(false);

    });
});