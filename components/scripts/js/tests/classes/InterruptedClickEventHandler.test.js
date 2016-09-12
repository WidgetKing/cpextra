/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/11/15
 * Time: 4:10 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the InterruptedClickEventHandler class", function () {

    "use strict";

    var eventHandlers,
        rightClickEvent = {
            "button":2
        },
        leftClickEvent = {
            "button":0
        },
        milliseconds;

    beforeEach(function () {

        eventHandlers = {};
        milliseconds = 0;

        window._extra = {
            "classes":unitTests.classes,
            "eventManager":{
                "events":{
                    "CLICK":"click",
                    "RIGHT_CLICK":"rightclick",
                    "DOUBLE_CLICK":"dblclick",
                    "MOUSE_DOWN":"mousedown",
                    "MOUSE_UP":"mouseup"
                },
                "useTouchEvents":true
            },
            "preferences":{
                "doubleClickDelay":2000
            },
            "w":{
                "document":{
                    "addEventListener":function (event, handler) {
                        eventHandlers.documentUp = handler;
                    },
                    "removeEventListener":jasmine.createSpy("document.removeEventListener")
                },
                "Date":function () {

                    this.milliseconds = milliseconds;

                    this.getTime = function () {
                        return this.milliseconds;
                    };
                }
            }
        };

        this.eventMediator = {
           "addEventListener":jasmine.createSpy("eventMediator.addEventListener").and.callFake(function (eventType,handler) {
              eventHandlers[eventType] = handler;
          }),
           "removeEventListener":jasmine.createSpy("eventMediator.removeEventListener"),
           "dispatchEvent":jasmine.createSpy("eventMediator.dispatchEvent")
        };

        this.handler = new unitTests.classes.InterruptedClickEventHandler(this.eventMediator);



    });

    afterEach(function () {
        delete window._extra;
    });

    it("should dispatch click event if down and up events are detected", function () {
        eventHandlers.mousedown(leftClickEvent);
        eventHandlers.mouseup(leftClickEvent);
        expect(this.eventMediator.dispatchEvent).toHaveBeenCalledWith("click");
    });

    // Swapped to using the 'contextmenu' event to detect right clicks, shouldn't need this test anymore.
    /*it("should dispatch a right click event if state changes part way through and it has been clicked with a right mouse button", function () {
        eventHandlers.mousedown(rightClickEvent);
        this.handler.stateHasChanged();
        eventHandlers.mouseup(rightClickEvent);
        expect(this.eventMediator.dispatchEvent).toHaveBeenCalledWith("rightclick");
    });*/

    it("should not dispatch a click event if we just get a mouse up and no mouse down", function () {
        eventHandlers.mouseup(leftClickEvent);
        expect(this.eventMediator.dispatchEvent).not.toHaveBeenCalled();
    });

    it("should not dispatch a click event if we moused up somewhere outside of the object", function () {
        eventHandlers.mousedown(leftClickEvent);
        eventHandlers.documentUp(leftClickEvent);
        eventHandlers.mouseup(leftClickEvent);
        expect(this.eventMediator.dispatchEvent).not.toHaveBeenCalled();
    });

    it("should unload listeners", function () {

        expect(this.eventMediator.removeEventListener).not.toHaveBeenCalled();
        this.handler.unload();
        expect(this.eventMediator.removeEventListener).toHaveBeenCalled();

    });

    it("should dispatch a double click event if two interrupted clicks occur close to each other", function () {

        eventHandlers.mousedown(leftClickEvent);
        eventHandlers.mouseup(leftClickEvent);
        eventHandlers.mousedown(leftClickEvent);
        eventHandlers.mouseup(leftClickEvent);
        expect(this.eventMediator.dispatchEvent).toHaveBeenCalledWith("dblclick");
        this.eventMediator.dispatchEvent.calls.reset();

        eventHandlers.mousedown(leftClickEvent);
        eventHandlers.mouseup(leftClickEvent);
        expect(this.eventMediator.dispatchEvent).not.toHaveBeenCalledWith("dblclick");

    });

    it("should NOT dispatch a double click event if two interrupted clicks occur far apart from each other", function () {

        // First Click
        eventHandlers.mousedown(leftClickEvent);
        eventHandlers.mouseup(leftClickEvent);

        // Second Click - Three seconds later
        milliseconds = 3000;
        eventHandlers.mousedown(leftClickEvent);
        eventHandlers.mouseup(leftClickEvent);
        expect(this.eventMediator.dispatchEvent).not.toHaveBeenCalledWith("dblclick");

        // Third Click - Two seconds later
        milliseconds += _extra.preferences.doubleClickDelay;
        eventHandlers.mousedown(leftClickEvent);
        eventHandlers.mouseup(leftClickEvent);
        expect(this.eventMediator.dispatchEvent).toHaveBeenCalledWith("dblclick");

    });
});