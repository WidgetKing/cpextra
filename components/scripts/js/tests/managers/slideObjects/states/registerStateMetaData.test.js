/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 4:34 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the _extra.slideObjects.states.registerStateMetaData method", function () {

    "use strict";

    var module = unitTests.getModule("registerStateMetaData");

    beforeEach(function () {

        var slideObjectDatas = {

        };

        window._extra = {
            "w":{
                "document":{
                    "removeEventListener":function () {}
                },
                "isNaN":isNaN,
                "parseFloat":parseFloat,
                "parseInt":parseInt,
                "Object":Object
            },
            "captivate":{
                "projectDIV":document.createElement("DIV")
            },
            "log":function () {},
            "error":function () {},
            "classes":unitTests.classes,
            "slideObjects":{
                "states":{
                    "changeCallback": new unitTests.classes.Callback()
                },
                "getSlideObjectByName":function () {

                    ///////////////////////////////////////////////////////////////////////
                    /////////////// SLIDE OBJECT PROXY MOCK HERE!!
                    ///////////////////////////////////////////////////////////////////////

                    return {
                        "addEventListener":function () {},
                        "removeEventListener":function () {},
                        "changeState":function () {}
                    };
                },
                "enteredSlideChildObjectsCallbacks":new unitTests.classes.Callback()
            },
            "dataManager":{
                "getSlideObjectDataByName":function (name) {
                    return slideObjectDatas[name];
                }
            },
            "variableManager":{
                "hasVariable":function (variableName) {
                    return true;
                },
                "listenForVariableChange":function () {

                },
                "getVariableValue":function(){

                }
            },
            "slideManager":{
                "currentSceneNumber":1,
                "currentSlideNumber":1,
                "currentSlideID":"1.1",
                "enterSlideCallback":new unitTests.classes.Callback()
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
            }
        };

        module();
        this.sendToManager = function (name, data) {
            slideObjectDatas[name] = data;
            _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback("*",name);
        };
    });

    afterEach(function () {
        delete window._extra;
    });










    it("should link state names with mouse conditions", function () {

        spyOn(_extra.slideObjects.states, "registerStateMetaData");

        this.sendToManager("foobar", {
            "states":[
                "Normal",
                "x_down",
                "x_rollover"
            ]
        });

        expect(_extra.slideObjects.states.registerStateMetaData).toHaveBeenCalledWith("foobar", {
            "d":{
                "x_down":null
            },
            "r": {
                "x_rollover":null
            }
        });

    });

    it("should link state names with variable conditions", function () {

        spyOn(_extra.slideObjects.states, "registerStateMetaData");

        this.sendToManager("foobar", {
            "states":[
                "Normal",
                "x_foobar"
            ]
        });

        expect(_extra.slideObjects.states.registerStateMetaData).toHaveBeenCalledWith("foobar", {
            "n":{
                "x_foobar":{
                    "foobar":null
                }
            }
        });

    });

    it("should link mouse conditions AND variables", function () {

        spyOn(_extra.slideObjects.states, "registerStateMetaData");

        this.sendToManager("foobar", {
            "states":[
                "Normal",
                "x_down_Foo",
                "X_bar_rollover"
            ]
        });

        expect(_extra.slideObjects.states.registerStateMetaData).toHaveBeenCalledWith("foobar", {
            "d":{
                "x_down_Foo":{
                    "Foo":null
                }
            },
            "r":{
                "X_bar_rollover":{
                    "bar":null
                }
            }
        });

    });

    it("should be able to read variables with underscores in their name", function () {

        spyOn(_extra.slideObjects.states, "registerStateMetaData");
        spyOn(_extra.variableManager, "hasVariable").and.callFake(function (variableName) {
            return variableName === "ls_variable_name" || variableName === "var";
        });

        this.sendToManager("foobar", {
            "states":[
                "Normal",
                "x_down_ls_variable_name",
                "X_ls_variable_name_over",
                // Currently this format is not supported as I can't think of a way to confirm that
                // 'ls' is part of a a variable name and not the value that 'var' should be set to.
                //"x_var_ls_variable_name",
                "x_ls_variable_name_5"
            ]
        });

        expect(_extra.slideObjects.states.registerStateMetaData).toHaveBeenCalledWith("foobar", {
            "d":{
                "x_down_ls_variable_name":{
                    "ls_variable_name":null
                }
            },
            "r":{
                "X_ls_variable_name_over":{
                    "ls_variable_name":null
                }
            },
            "n":{
                /*"x_var_ls_variable_name":{
                    "var":null,
                    "ls_variable_name":null
                },*/
                "x_ls_variable_name_5":{
                    "ls_variable_name":5
                }
            }
        });

    });

    it("should recognize x_normal as a neutral mouse state", function () {

        spyOn(_extra.slideObjects.states, "registerStateMetaData");

        this.sendToManager("foobar", {
            "states":[
                "Normal",
                "x_NORMAL_Foo"
            ]
        });

        expect(_extra.slideObjects.states.registerStateMetaData).toHaveBeenCalledWith("foobar", {
            "n":{
                "x_NORMAL_Foo":{
                    "Foo":null
                }
            }
        });

    });

    it("should listen for multiple variables", function () {

        spyOn(_extra.slideObjects.states, "registerStateMetaData");

        this.sendToManager("foobar", {
            "states":[
                "Normal",
                "x_down_Foo_Bar"
            ]
        });

        expect(_extra.slideObjects.states.registerStateMetaData).toHaveBeenCalledWith("foobar", {
            "d":{
                "x_down_Foo_Bar":{
                    "Foo":null,
                    "Bar":null
                }
            }
        });

    });


    it("should allow us to define what the variable should equal", function () {

        spyOn(_extra.slideObjects.states, "registerStateMetaData");
        spyOn(_extra.variableManager, "hasVariable").and.callFake(function (varName) {
            return varName === "Foo" || varName === "Bar";
        });

        this.sendToManager("foobar", {
            "states":[
                "Normal",
                "x_down_Foo_0",
                "x_Bar_1_Foo"
            ]
        });

        expect(_extra.slideObjects.states.registerStateMetaData).toHaveBeenCalledWith("foobar", {
            "d":{
                "x_down_Foo_0":{
                    "Foo":0
                }
            },
            "n":{
                "x_Bar_1_Foo":{
                    "Bar":1,
                    "Foo":null
                }
            }
        });

    });

    it("should allow us to define what the variable should equal", function () {

        spyOn(_extra.slideObjects.states, "registerStateMetaData");
        spyOn(_extra.variableManager, "hasVariable").and.callFake(function (varName) {
            return varName === "variable";
        });

        this.sendToManager("foobar", {
            "states":[
                "Normal",
                "x_down_variable_value"
            ]
        });

        expect(_extra.slideObjects.states.registerStateMetaData).toHaveBeenCalledWith("foobar", {
            "d":{
                "x_down_variable_value":{
                    "variable":"value"
                }
            }
        });

    });

    it("should format the value data", function () {

        spyOn(_extra.slideObjects.states, "registerStateMetaData");
        spyOn(_extra.variableManager, "hasVariable").and.callFake(function (varName) {
            return varName === "variable";
        });

        this.sendToManager("foobar", {
            "states":[
                "Normal",
                "x_variable_true",
                "x_variable_FALSE",
                "x_variable_string",
                "x_variable_0"
            ]
        });

        expect(_extra.slideObjects.states.registerStateMetaData).toHaveBeenCalledWith("foobar", {
            "n":{
                "x_variable_true":{
                    "variable":true
                },
                "x_variable_FALSE":{
                    "variable":false
                },
                "x_variable_string":{
                    "variable":"string"
                },
                "x_variable_0":{
                    "variable":0
                }
            }
        });

    });

    it("should notify us when we input an invalid variable name", function () {

        spyOn(_extra.variableManager, "hasVariable").and.callFake(function (varName) {
            return varName === "variable";
        });

        spyOn(_extra,"error");

        this.sendToManager("foobar", {
            "states":[
                "x_notvariable"
            ]
        });

        expect(_extra.error).toHaveBeenCalled();
    });

    it("should prevent us from entering the same variable twice", function () {

        spyOn(_extra.variableManager, "hasVariable").and.callFake(function (varName) {
            return varName === "variable";
        });
        spyOn(_extra, "error");

        this.sendToManager("foobar", {
            "states":[
                "x_variable_variable"
            ]
        });
        expect(_extra.error).toHaveBeenCalled();


        _extra.error.calls.reset();

        this.sendToManager("foobar", {
            "states":[
                "x_variable_0_variable"
            ]
        });

        expect(_extra.error).toHaveBeenCalled();
    });

    it("should tell us whether a certain slide object is having its states automatically switched", function () {
        _extra.slideObjects.states.registerStateMetaData("foobar", {});
        expect(_extra.slideObjects.states.isAutomaticallyChangingStates("foobar")).toBe(true);
        expect(_extra.slideObjects.states.isAutomaticallyChangingStates("invalid")).toBe(false);
    });

    it("should unload state managers when moving to a new slide", function () {


        _extra.slideManager.currentSlideNumber = 1;
        _extra.slideManager.currentSlideID = "1.1";

        _extra.slideObjects.states.registerStateMetaData("foobar", {});

        expect(_extra.slideObjects.states.isAutomaticallyChangingStates("foobar")).toBe(true);


        spyOn(_extra,"error");
        _extra.slideObjects.states.registerStateMetaData("foobar", {});
        expect(_extra.error).toHaveBeenCalled();

        _extra.slideManager.currentSlideNumber = 2;
        _extra.slideManager.currentSlideID = "1.2";
        _extra.slideObjects.states.registerStateMetaData("registeredBeforeEnterSlideCallback", {});
        _extra.slideManager.enterSlideCallback.sendToCallback("*","1.2");

        expect(_extra.slideObjects.states.isAutomaticallyChangingStates("foobar")).toBe(false);
        expect(_extra.slideObjects.states.isAutomaticallyChangingStates("registeredBeforeEnterSlideCallback")).toBe(true);

    });

    it("should be able to tell us if a slide object has a down state", function () {

        this.sendToManager("foo", {
           "states":[
               "Normal",
               "x_down"
           ]
        });

        this.sendToManager("bar", {
           "states":[
               "Normal",
               "x_rollover"
           ]
        });

        expect(_extra.slideObjects.states.doesSlideObjectHaveDownState("foo")).toBe(true);
        expect(_extra.slideObjects.states.doesSlideObjectHaveDownState("bar")).toBe(false);

    });

    it("should be able to detect if the state wishes a variable NOT to equal something", function () {

        spyOn(_extra.slideObjects.states, "registerStateMetaData");
        spyOn(_extra.variableManager, "hasVariable").and.callFake(function (name) {
            return name === "MyVar";
        });

        this.sendToManager("foobar", {
           "states":[
               "Normal",
               "x_MyVar_not_true"
           ]
        });

        expect(_extra.slideObjects.states.registerStateMetaData).toHaveBeenCalledWith("foobar", {
            "n": {
                "x_MyVar_not_true":{
                    "MyVar":{
                        "value":true,
                        "modifier":"!"
                    }
                }
            }
        });

    });

    it("should be able to detect greater than and lesser than keywords", function () {

        spyOn(_extra.slideObjects.states, "registerStateMetaData");
        spyOn(_extra.variableManager, "hasVariable").and.callFake(function (name) {
            return name === "MyVar";
        });

        this.sendToManager("foobar", {
           "states":[
               "Normal",
               "x_MyVar_gt_1",
               "x_MyVar_lt_1",
               "x_MyVar_gte_1",
               "x_MyVar_lte_1"
           ]
        });

        expect(_extra.slideObjects.states.registerStateMetaData).toHaveBeenCalledWith("foobar", {
            "n": {
                "x_MyVar_gt_1":{
                    "MyVar":{
                        "value":1,
                        "modifier":">"
                    }
                },
                "x_MyVar_lt_1":{
                    "MyVar":{
                        "value":1,
                        "modifier":"<"
                    }
                },
                "x_MyVar_gte_1":{
                     "MyVar":{
                         "value":1,
                         "modifier":">="
                     }
                 },
                 "x_MyVar_lte_1":{
                     "MyVar":{
                         "value":1,
                         "modifier":"<="
                     }
                 }
            }
        });

    });

    it("should throw an error if no value is given after a keyword", function () {

        spyOn(_extra.slideObjects.states, "registerStateMetaData");
        spyOn(_extra.variableManager, "hasVariable").and.callFake(function (name) {
            return name === "MyVar";
        });
        spyOn(_extra,"error");

        this.sendToManager("foobar", {
           "states":[
               "Normal",
               "x_MyVar_not"
           ]
        });

        expect(_extra.error).toHaveBeenCalled();

    });

});