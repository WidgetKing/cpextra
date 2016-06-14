/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 2:30 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the DoubleClickHandler", function () {

    "use strict";

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "eventManager":{
                "events":{
                    "CLICK":"click",
                    "RIGHT_CLICK":"contextmenu",
                    "DOUBLE_CLICK":"dblclick",
                    "MOUSE_DOWN":"mousedown",
                    "MOUSE_UP":"mouseup"
                }
            },
            "preferences": {
                "doubleClickDelay":500
            },
            "w":{
                "setTimeout":jasmine.createSpy("extra.w.setTimeout"),
                "clearTimeout":jasmine.createSpy("extra.w.clearTimeout")
            }
        };

        this.mediator = new unitTests.classes.EventMediator();
        this.doubleClickHandler = new unitTests.classes.DoubleClickHandler();

        this.dummy = jasmine.createSpy("dummy");
    });

    afterEach(function () {
        delete window._extra;
    });




    it("should be able to register event handlers for events relating to double clicking", function () {

        expect(this.doubleClickHandler.addEventHandler("click", this.dummy)).not.toBe(this.dummy);
        expect(this.doubleClickHandler.addEventHandler("dblclick", this.dummy)).not.toBe(this.dummy);

        // We don't care about the mouse down event, so it shouldn't be wrapped.
        expect(this.doubleClickHandler.addEventHandler("mousedown", this.dummy)).toBe(this.dummy);

    });

    it("should execute the callback immediately if _extra.preferences.doubleClickDelay is 0", function () {

        _extra.preferences.doubleClickDelay = 0;

        var callback = this.doubleClickHandler.addEventHandler("click", this.dummy);
        this.doubleClickHandler.addEventHandler("dblclick", function () {});
        callback();

        expect(this.dummy).toHaveBeenCalled();

    });

    it("should execute the callback immediately if there is no double click handler", function () {

        var callback = this.doubleClickHandler.addEventHandler("click", this.dummy);
        callback();

        expect(this.dummy).toHaveBeenCalled();

    });

    it("should call the click callback after a delay set by _extra.preferences.doubleClickDelay", function () {

        // setup
        var timeoutCallback;

        _extra.w.setTimeout.and.callFake(function (callback, duration) {
            timeoutCallback = callback;
            expect(duration).toEqual(_extra.preferences.doubleClickDelay);
            return 1;
        });


        // test
        var singleClickCallback = this.doubleClickHandler.addEventHandler("click", this.dummy);
        this.doubleClickHandler.addEventHandler("dblclick", function () {});

        // First click
        singleClickCallback();
        expect(timeoutCallback).toBeDefined();
        expect(this.dummy).not.toHaveBeenCalled();

        // The time period has ended.
        timeoutCallback();
        expect(this.dummy).toHaveBeenCalled();

        // In this case there was too much of a delay between the first click and the second.
        // This was a regular click. Not a double click.

    });

    it("should call the dblclick callback if it was clicked twice before the interval has ended", function () {

        // setup
        var timeoutCallback,
            timeoutID = 1,
            singleClickDummy = jasmine.createSpy("Single Click Dummy"),
            doubleClickDummy = jasmine.createSpy("Double Click Dummy");

        _extra.w.setTimeout.and.callFake(function (callback, duration) {
            timeoutCallback = callback;
            return timeoutID;
        });

        // test
        var singleClickCallback = this.doubleClickHandler.addEventHandler("click", singleClickDummy);
        var doubleClickCallback = this.doubleClickHandler.addEventHandler("dblclick", doubleClickDummy);

        // First click
        singleClickCallback();
        singleClickCallback();
        expect(doubleClickDummy).not.toHaveBeenCalled();
        doubleClickCallback();
        expect(_extra.w.clearTimeout).toHaveBeenCalledWith(timeoutID);
        expect(singleClickDummy).not.toHaveBeenCalled();
        expect(doubleClickDummy).toHaveBeenCalled();

    });

    it("should call double clicks normally if there is no click listener", function () {

        var doubleClickCallback = this.doubleClickHandler.addEventHandler("dblclick", this.dummy);

        doubleClickCallback();

        expect(this.dummy).toHaveBeenCalled();

    });

    // Wrote this to track down an issue, but the issue turned out to be associated with InteruptedClickEventHandler.
    /*it("should call one double click and then a single click if you click three times on a shape", function () {

        // setup
        var timeoutCallback,
            timeoutID = 1,
            singleClickDummy = jasmine.createSpy("Single Click Dummy"),
            doubleClickDummy = jasmine.createSpy("Double Click Dummy");

        _extra.w.setTimeout.and.callFake(function (callback, duration) {
            timeoutCallback = callback;
            return timeoutID;
        });

        // test
        var singleClickCallback = this.doubleClickHandler.addEventHandler("click", singleClickDummy);
        var doubleClickCallback = this.doubleClickHandler.addEventHandler("dblclick", doubleClickDummy);

        // First click
        singleClickCallback();
        timeoutCallback();
        expect(singleClickDummy).toHaveBeenCalled();
        singleClickDummy.calls.reset();

        // Second click
        singleClickCallback();
        doubleClickCallback();
        expect(doubleClickDummy).toHaveBeenCalled();
        doubleClickDummy.calls.reset();

        // Third click
        singleClickCallback();
        expect(doubleClickDummy).not.toHaveBeenCalled();

    });*/

    it("should call double click if two clicks are made during the time period BUT double click is not called", function () {

        // setup
        var timeoutCallback,
            timeoutID = 1,
            singleClickDummy = jasmine.createSpy("Single Click Dummy"),
            doubleClickDummy = jasmine.createSpy("Double Click Dummy");

        _extra.w.setTimeout.and.callFake(function (callback) {
            timeoutCallback = callback;
            return timeoutID;
        });

        // test
        var singleClickCallback = this.doubleClickHandler.addEventHandler("click", singleClickDummy);
        this.doubleClickHandler.addEventHandler("dblclick", doubleClickDummy);

        // First click
        singleClickCallback();
        singleClickCallback();
        expect(doubleClickDummy).not.toHaveBeenCalled();
        timeoutCallback();
        expect(singleClickDummy).not.toHaveBeenCalled();
        expect(doubleClickDummy).toHaveBeenCalled();

    });

    it("should allow us to remove handlers", function () {

        var singleClickDummy = jasmine.createSpy("Single Click Dummy"),
            doubleClickDummy = jasmine.createSpy("Double Click Dummy"),
            singleClickCallback,
            doubleClickCallback;

        singleClickCallback = this.doubleClickHandler.addEventHandler("click", singleClickDummy);
        doubleClickCallback = this.doubleClickHandler.addEventHandler("dblclick", doubleClickDummy);

        this.doubleClickHandler.removeEventHandler("click");
        singleClickCallback();
        expect(singleClickDummy).not.toHaveBeenCalled();

        this.doubleClickHandler.removeEventHandler("dblclick");
        doubleClickCallback();
        expect(doubleClickDummy).not.toHaveBeenCalled();

    });

    it("should prevent a context menu from appearing", function () {

        var rightClickDummy = jasmine.createSpy("Right Click Dummy"),
            rightClickCallback = this.doubleClickHandler.addEventHandler(_extra.eventManager.events.RIGHT_CLICK, rightClickDummy),
            eventData = {
                "preventDefault": jasmine.createSpy("event.preventDefault")
            };

        rightClickCallback(eventData);
        expect(eventData.preventDefault).toHaveBeenCalled();
        expect(rightClickDummy).toHaveBeenCalledWith(eventData);


    });
});