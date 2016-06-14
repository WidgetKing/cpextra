/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 11:21 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the util methods linked to command variables on _extra.slideObjects", function () {

    "use strict";

    var module = unitTests.getModule("slideObjectUtilMethods");

    beforeEach(function () {

        var parsedData = {
            "slideObject":{
                "isVariable":false,
                "isSlideObject":true,
                "isQuery":false,
                "isNumber":false,
                "value":"slideObject"
            },
            "100":{
                "isVariable":false,
                "isSlideObject":false,
                "isQuery":false,
                "isNumber":true,
                "value":100
            },
            "variable":{
                "isVariable":true,
                "isSlideObject":false,
                "isQuery":false,
                "isNumber":false,
                "value":"variable",
                "variable":{
                    "value":"variableValue",
                    "isNumber":false,
                    "isSlideObject":false,
                    "isQuery":false,
                    "isCustomType":false
                }
            },
            "variable_so":{
                "isVariable":true,
                "isSlideObject":false,
                "isQuery":false,
                "isNumber":false,
                "value":"variable_so",
                "variable":{
                    "value":"slideObject",
                    "isSlideObject":true
                }
            },
            "variable_so_notOnSlide":{
                "isVariable":true,
                "isSlideObject":false,
                "isQuery":false,
                "isNumber":false,
                "value":"variable_so_notOnSlide",
                "variable":{
                    "value":"notOnSlide",
                    "isNumber":false,
                    "isSlideObject":true
                }
            },
            "variable_10":{
                "isVariable":true,
                "isSlideObject":false,
                "isQuery":false,
                "isNumber":false,
                "value":"variable_so_notOnSlide",
                "variable":{
                    "value":10,
                    "isNumber":true,
                    "isSlideObject":true,
                    "isCustomType":false
                }
            },
            "notOnSlide": {
                "isVariable":false,
                "isSlideObject":true,
                "isQuery":false,
                "isNumber":false,
                "value":"notOnSlide"
            },
            "slideOb@":{
                "isVariable":false,
                "isSlideObject":false,
                "isQuery":true,
                "isNumber":false,
                "value":"slideOb@"
            },
            "mousedown":{
                "isVariable":false,
                "isSlideObject":false,
                "isQuery":false,
                "isNumber":false,
                "isCustomType":true,
                "value":"mousedown",
                "eventType":{
                    "type":"mouseevent",
                    "name":"mousedown"
                }
            },
            "undefined":{
                "isVariable":false,
                "isSlideObject":false,
                "isQuery":false,
                "isBlank":true,
                "isNumber":false,
                "value":undefined
            },
            "invalid": {
                "isVariable":false,
                "isSlideObject":false,
                "isQuery":false,
                "isBlank":false,
                "value":"invalid"
            },
            "variable_invalid":{
                "isVariable":true,
                "isSlideObject":false,
                "isQuery":false,
                "isBlank":false,
                "value":"invalid",
                "variable":{
                    "isVariable":false,
                    "isSlideObject":false,
                    "isQuery":false,
                    "isBlank":false,
                    "value":"invalid"
                }
            },
            "failure":{
                "isVariable":false,
                "isSlideObject":false,
                "isQuery":false,
                "isNumber":false,
                "value":"failure"
            },
            "variableQuery":{
                "isVariable":true,
                "isSlideObject":false,
                "isQuery":false,
                "isNumber":false,
                "value":"MyVar",
                "variable":{
                    "value":"slideOb@",
                    "isSlideObject":false,
                    "isNumber":false,
                    "isQuery":true
                }
            },
            "default": {
                "isVariable":false,
                "isSlideObject":false,
                "isQuery":false,
                "isNumber":false,
                "isCustomType":true
            },
            "videoended": {
                "isVariable":false,
                "isSlideObject":false,
                "isQuery":false,
                "isNumber":false,
                "isCustomType":true,
                "eventType":{
                    "type": "videoevent",
                    "name": "videoended"
                }
            }
        };

        var slideObjects = {
            "slideObject":{
                "x":"slideObject.x",
                "y":"slideObject.y"
            },
            "slideObX":{
                "x":"slideObX.x",
                "y":"slideObX.y"
            }
        };

        var eventMediators = {

        };

        window._extra = {
            "error": jasmine.createSpy("_extra.error"),
            "classes":unitTests.classes,
            "slideObjects":{
                "model":{
                    "write":jasmine.createSpy("slideObjects.model.write"),
                    "retrieve":jasmine.createSpy("slideObjects.model.retrieve")
                },
                "getSlideObjectByName":function (name) {
                    return slideObjects[name];
                },
                "enactFunctionOnSlideObjects":function () {

                }
            },
            "variableManager": {
                "parse":{
                    "string":function (name) {
                        return parsedData[name];
                    }
                },
                "setVariableValue":jasmine.createSpy("variableManager.setVariableValue")
            },
            "eventManager":{
                "getEventMediator":function (slideObjectName) {
                    if (!eventMediators[slideObjectName]) {
                        eventMediators[slideObjectName] = {
                            "addEventListener":jasmine.createSpy("EventMediator.addEventListener"),
                            "removeEventListener":jasmine.createSpy("EventMediator.removeEventListener")
                        };
                    }
                    return eventMediators[slideObjectName];
                },
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
                    "DOUBLE_CLICK": "dblclick",
                    "VIDEO_ENDED": "videoended"
                }
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the enable and disable mouse events methods", function () {
        expect(_extra.slideObjects.enableForMouse).toBeDefined();
        expect(_extra.slideObjects.disableForMouse).toBeDefined();
    });



    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// PROPERTY COMMAND VARIABLES
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////
    /////////////// GET
    ///////////////////////////////////////////////////////////////////////

    it("should be able to get the value from the slide object", function () {

        var s =_extra.variableManager.setVariableValue;

        // Direct Slide Object
        _extra.slideObjects.posX("variable","slideObject");
        expect(s).toHaveBeenCalledWith("variable","slideObject.x");

        // Reset test
        s.calls.reset();

        // With Variable value slide object
        _extra.slideObjects.posX("variable","variable_so");
        expect(s).toHaveBeenCalledWith("variable","slideObject.x");

    });

    it("should be able to get the value from the model if the slide object is not on stage", function () {
        var r = _extra.slideObjects.model.retrieve,
            s =_extra.variableManager.setVariableValue;

        r.and.returnValue("fromModel");

        // Direct Slide Object
        _extra.slideObjects.posX("variable", "notOnSlide");
        expect(s).toHaveBeenCalledWith("variable","fromModel");

        // Reset test
        s.calls.reset();

        // With Variable value slide object
        _extra.slideObjects.posX("variable","variable_so_notOnSlide");
        expect(s).toHaveBeenCalledWith("variable","fromModel");
    });

    it("should report errors if we pass in invalid values", function () {

        var r = _extra.slideObjects.model.retrieve,
            s =_extra.variableManager.setVariableValue;


        _extra.slideObjects.posX("invalid", "slideObject");
        expect(s).not.toHaveBeenCalled();
        expect(_extra.error.calls.argsFor(0)[0]).toEqual("CV040");
        _extra.error.calls.reset();

        _extra.slideObjects.width("invalid", "slideObject");
        expect(s).not.toHaveBeenCalled();
        expect(_extra.error.calls.argsFor(0)[0]).toEqual("CV040");
        _extra.error.calls.reset();

        _extra.slideObjects.posX("variable_invalid", "invalid");
        expect(s).not.toHaveBeenCalled();
        expect(_extra.error.calls.argsFor(0)[0]).toEqual("CV042");
        _extra.error.calls.reset();

        _extra.slideObjects.posX("variable_invalid", "variable_invalid");
        expect(s).not.toHaveBeenCalled();
        expect(_extra.error.calls.argsFor(0)[0]).toEqual("CV042");
        _extra.error.calls.reset();

    });






    ///////////////////////////////////////////////////////////////////////
    /////////////// SET
    ///////////////////////////////////////////////////////////////////////
    it("should be able to set when given a slide object name", function () {
        var m = _extra.slideObjects.posX,
            s = _extra.slideObjects.model.write;

        // SET
        m("slideObject",100);
        expect(s).toHaveBeenCalledWith("slideObject", "x", 100);
        s.calls.reset();

        m("slideObject","variable_10");
        expect(s).toHaveBeenCalledWith("slideObject", "x", 10);
    });

    it("should be able to set when given a variable with the value of a slide object name", function () {
        var m = _extra.slideObjects.posX,
            s = _extra.slideObjects.model.write;

        // SET
        m("variable_so",100);
        expect(s).toHaveBeenCalledWith("slideObject", "x", 100);
        s.calls.reset();

        m("variable_so","variable_10");
        expect(s).toHaveBeenCalledWith("slideObject", "x", 10);
    });

    it("should be able to set when given a @ syntax query", function () {
        var m = _extra.slideObjects.posX,
            s = _extra.slideObjects.model.write;

        _extra.slideObjects.enactFunctionOnSlideObjects = function (query, callback) {
            expect(query).toBe("slideOb@");
            callback("slideObject");
            callback("slideObX");
        };

        // SET
        m("slideOb@",100);
        expect(s).toHaveBeenCalledWith("slideObject", "x", 100);
        expect(s).toHaveBeenCalledWith("slideObX", "x", 100);

        m("slideOb@","variable_10");
        expect(s).toHaveBeenCalledWith("slideObject", "x", 10);
        expect(s).toHaveBeenCalledWith("slideObX", "x", 10);
    });

    it("should be able to receive a query from a variable value", function () {
        var m = _extra.slideObjects.posX,
            s = _extra.slideObjects.model.write;

        _extra.slideObjects.enactFunctionOnSlideObjects = function (query, callback) {
            expect(query).toBe("slideOb@");
            callback("slideObject");
            callback("slideObX");
        };

        // SET
        m("variableQuery",100);
        expect(s).toHaveBeenCalledWith("slideObject", "x", 100);
        expect(s).toHaveBeenCalledWith("slideObX", "x", 100);

        m("variableQuery","variable_10");
        expect(s).toHaveBeenCalledWith("slideObject", "x", 10);
        expect(s).toHaveBeenCalledWith("slideObX", "x", 10);
    });


    it("should see 'default' as a valid value but other strings as invalid", function () {

        var m = _extra.slideObjects.posX,
            s = _extra.slideObjects.model.write;

        // SET
        m("slideObject", "default");
        expect(s).toHaveBeenCalledWith("slideObject", "x", "default");
        s.calls.reset();

        m("slideObject","invalid");
        expect(s).not.toHaveBeenCalled();
        expect(_extra.error).toHaveBeenCalled();
        s.calls.reset();
        _extra.error.calls.reset();

        m("slideObject","variable_invalid");
        expect(s).not.toHaveBeenCalled();
        expect(_extra.error).toHaveBeenCalled();


    });

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// EVENT COMMAND VARIABLES
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    it("should allow us to add an event listener to a slide object", function () {

        var m = _extra.slideObjects.addEventListener,
            em = _extra.eventManager.getEventMediator("slideObject");

        m("slideObject","mousedown","slideObject");
        expect(em.addEventListener).toHaveBeenCalledWith("mousedown","slideObject","success");

        m("slideObject","mousedown","slideObject","failure");
        expect(em.addEventListener).toHaveBeenCalledWith("mousedown","slideObject","failure");

    });

    it("should allow us to add an event listener to a slide whose name is stored in a variable", function () {

        var m = _extra.slideObjects.addEventListener,
            em = _extra.eventManager.getEventMediator("slideObject");

        m("variable_so","mousedown","slideObject");
        expect(em.addEventListener).toHaveBeenCalledWith("mousedown","slideObject","success");

        m("variable_so","mousedown","slideObject","failure");
        expect(em.addEventListener).toHaveBeenCalledWith("mousedown","slideObject","failure");

    });

    it("should allow us to add event listeners to all slide objects matching an @ syntax query", function () {

        var m = _extra.slideObjects.addEventListener,
            soem = _extra.eventManager.getEventMediator("slideObject"),
            soxem = _extra.eventManager.getEventMediator("slideObX");

        _extra.slideObjects.enactFunctionOnSlideObjects = function (query, callback) {
            expect(query).toBe("slideOb@");
            callback("slideObject");
            callback("slideObX");
        };

        // SET
        m("slideOb@","mousedown","slideObject");
        expect(soem.addEventListener).toHaveBeenCalledWith("mousedown", "slideObject", "success");
        expect(soxem.addEventListener).toHaveBeenCalledWith("mousedown", "slideObject", "success");

        m("slideOb@","mousedown","slideObject", "failure");
        expect(soem.addEventListener).toHaveBeenCalledWith("mousedown", "slideObject", "failure");
        expect(soxem.addEventListener).toHaveBeenCalledWith("mousedown", "slideObject", "failure");

    });

    it("should allow us to add an event listener to an @syntax query whose name is stored in a variable", function () {

        var m = _extra.slideObjects.addEventListener,
            soem = _extra.eventManager.getEventMediator("slideObject"),
            soxem = _extra.eventManager.getEventMediator("slideObX");

        _extra.slideObjects.enactFunctionOnSlideObjects = function (query, callback) {
            expect(query).toBe("slideOb@");
            callback("slideObject");
            callback("slideObX");
        };


        m("variableQuery","mousedown","slideObject");
        expect(soem.addEventListener).toHaveBeenCalledWith("mousedown", "slideObject", "success");
        expect(soxem.addEventListener).toHaveBeenCalledWith("mousedown", "slideObject", "success");

    });

    it("should allow us to listen for 'ended' events on video objects", function () {

        var m = _extra.slideObjects.addEventListener,
            em = _extra.eventManager.getEventMediator("slideObject");

        m("slideObject","videoended","slideObject");
        expect(em.addEventListener).toHaveBeenCalledWith("videoended","slideObject","success");

    });

});