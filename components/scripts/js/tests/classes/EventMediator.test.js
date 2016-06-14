/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 4/11/15
 * Time: 3:20 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the EventMediator class", function () {

    "use strict";

    function MockListener() {
        this.addEventListener = jasmine.createSpy("listener.addEventListener");
        this.removeEventListener = jasmine.createSpy("listener.removeEventListener");
        this.hasEventListener = jasmine.createSpy("listener.hasEventListener");
    }

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "error":jasmine.createSpy("_extra.error"),
            "eventManager":{
                "setEventTarget":jasmine.createSpy("_extra.eventManager.setTarget"),
                "events":{
                    "CLICK":"click",
                    "RIGHT_CLICK":"contextmenu",
                    "DOUBLE_CLICK":"dblclick",
                    "MOUSE_DOWN":"mousedown",
                    "MOUSE_UP":"mouseup",
                    "MOUSE_OVER":"mouseover",
                    "MOUSE_OUT":"mouseout"
                }
            },
            "preferences":{
                "doubleClickDelay":0
            },
            "actionManager":{
                "callActionOn":jasmine.createSpy("_extra.actionManager.callActionOn")
            },
            "w":{
                "Object":Object
            },
            "createEvent": function() {
                return "eventobject";
            }
        };

        this.listener = new MockListener();

        this.mediator = new unitTests.classes.EventMediator(this.listener);
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should allow us to set its id expose its id", function () {

        var mediator = new unitTests.classes.EventMediator(this.listener);
        mediator.setId("MyId");
        expect(mediator.id).toBe("MyId");

        // We shouldn't be allowed to set an id outside of using the setId method.
        expect(function () {
            mediator.id = "Test";
        }).toThrow();

    });

    it("should allow us to add an event to an event listener", function () {

        this.mediator.addEventListener("click", "button", "success");
        expect(this.listener.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

    });

    it("should allow us to dispatch a particular event", function () {

        this.mediator.addEventListener("click", "button", "success");
        this.mediator.dispatchEvent("click");
        expect(_extra.actionManager.callActionOn).toHaveBeenCalledWith("button", "success");

    });

    it("If we dispatch an event from a mediator with an Id, it should inform the Event Manager of the new target", function () {

        this.mediator.setId("MyId");
        this.mediator.addEventListener("click", "button", "success");
        this.mediator.dispatchEvent("click");
        expect(_extra.eventManager.setEventTarget).toHaveBeenCalledWith("MyId");

    });

    it("shouldn't duplicate listeners", function () {

        this.mediator.addEventListener("click", "button", "success");
        this.listener.addEventListener.calls.reset();
        this.mediator.addEventListener("click", "button", "success");
        expect(this.listener.addEventListener).not.toHaveBeenCalled();

    });

    it("should convert common misspellings of events to their proper event", function () {

        var mediator = this.mediator,
            listener = this.listener;

        function testEvent(properName, misspelling) {
            mediator.addEventListener(misspelling, "button", "success");
            expect(listener.addEventListener).toHaveBeenCalledWith(properName, jasmine.any(Function));

            mediator.removeEventListener(misspelling, "button", "success");
            expect(listener.removeEventListener).toHaveBeenCalledWith(properName, jasmine.any(Function));
        }

        testEvent("dblclick", "doubleclick");
        testEvent("mouseover", "rollover");
        testEvent("mouseout", "rollout");


    });

    it("should execute a callback when it has lost all events AND listeners", function () {

        // First get rid of events THEN get rid of listener
        var dummy = jasmine.createSpy("dummy");
        this.mediator.addEventListener("click", "button", "success");
        this.mediator.registerOnEmptyCallback(dummy);
        this.mediator.removeEventListener("click", "button", "success");
        expect(dummy).not.toHaveBeenCalled();
        this.mediator.swap(null);
        expect(dummy).toHaveBeenCalled();

        // No listener, get rid of event
        dummy.calls.reset();
        this.mediator.addEventListener("click", "button", "success");
        this.mediator.removeEventListener("click", "button", "success");
        expect(dummy).toHaveBeenCalled();

    });

    it("should allow us to swap event listeners at any time", function () {

        var newListener = new MockListener(),
            callback;

        this.mediator.addEventListener("click", "button", "success");
        callback = this.listener.addEventListener.calls.argsFor(0)[1];

        this.mediator.swap(newListener);

        expect(this.listener.removeEventListener).toHaveBeenCalledWith("click", callback);
        expect(newListener.addEventListener).toHaveBeenCalledWith("click", callback);

    });

    it("should allow us to record data for an object that doesn't exist yet, and then allow us to add the listener", function () {

        var mediator = new unitTests.classes.EventMediator(),
            newListener = new MockListener();

        mediator.addEventListener("click", "button", "success");

        mediator.swap(newListener);

        expect(newListener.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

    });

    it("should allow us to work with multiple listeners", function () {

        var l1 = new MockListener(),
            l2 = new MockListener(),
            mediator = new unitTests.classes.EventMediator(l1,l2);

        mediator.addEventListener("click", "button", "success");

        expect(l1.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));
        expect(l2.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

    });

    it("should allow us to add a new listener", function () {
        var newListener = new MockListener(),
            callback;

        this.mediator.addEventListener("click", "button", "success");
        callback = this.listener.addEventListener.calls.argsFor(0)[1];

        this.mediator.add(newListener);

        expect(this.listener.removeEventListener).not.toHaveBeenCalled();
        expect(newListener.addEventListener).toHaveBeenCalledWith("click", callback);
    });

    it("should allow us to remove an event listener", function () {

        this.mediator.addEventListener("click", "button", "success");
        this.mediator.removeEventListener("click", "button", "success");
        expect(this.listener.removeEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

        // And also expect that it will wipe the recorded data for that event.
        var newListener= new MockListener();
        this.mediator.add(newListener);
        expect(newListener.addEventListener).not.toHaveBeenCalled();

    });

    it("should allow us to use functions as callbacks instead of interactive object criteria", function () {

        var dummy = jasmine.createSpy("dummy");

        this.mediator.addEventListener("click", dummy);
        this.mediator.dispatchEvent("click");
        expect(dummy).toHaveBeenCalledWith("eventobject");
        dummy.calls.reset();


        var event = {
            "type":"click"
        };
        this.mediator.dispatchEvent(event);
        expect(dummy).toHaveBeenCalledWith(event);

        dummy.calls.reset();

        this.mediator.removeEventListener("click", dummy);
        this.mediator.dispatchEvent("click");
        expect(dummy).not.toHaveBeenCalled();

    });

    it("shouldn't duplicate function listeners", function () {

        var dummy = jasmine.createSpy("dummy");

        this.mediator.addEventListener("click", dummy);
        this.mediator.addEventListener("click", dummy);
        this.mediator.dispatchEvent("click");
        expect(dummy.calls.count()).toBe(1);

    });

    it("should allow us to add or swap multiple listeners", function () {

        var l1 = new MockListener();
        var l2 = new MockListener();

        this.mediator.addEventListener("click", "button", "success");
        this.mediator.swap(l1, l2);

        expect(l1.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));
        expect(l2.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

    });

    it("should tell us if we have a listener for a particular event", function () {
        this.mediator.addEventListener("click", "button", "success");
        expect(this.mediator.hasEventListener("click", "button", "success")).toBe(true);
        expect(this.mediator.hasEventListener("click", "button", "failure")).toBe(false);
    });

    it("should call event handlers in the order they were added", function () {

        var dummy2 = jasmine.createSpy("dummy2");
        var dummy1 = jasmine.createSpy("dummy1").and.callFake(function () {
            expect(dummy2).not.toHaveBeenCalled();
        });

        this.mediator.addEventListener("click", dummy1);
        this.mediator.addEventListener("click", dummy2);
        this.mediator.dispatchEvent("click");
        expect(dummy1).toHaveBeenCalled();

    });

    it("should not skip over event handlers, if we remove event handlers while an event is being dispatched", function () {

        var that = this;
        var dummy1 = jasmine.createSpy("dummy1").and.callFake(function () {
            that.mediator.removeEventListener("click", dummy1);
        });
        var dummy2 = jasmine.createSpy("dummy2");

        // Test when one element is removed
        this.mediator.addEventListener("click", dummy1);
        this.mediator.addEventListener("click", dummy2);
        this.mediator.dispatchEvent("click");
        expect(dummy1).toHaveBeenCalled();
        expect(dummy2).toHaveBeenCalled();

    });

    it("should not skip over event handlers, if we remove MULTIPLE handlers from the BACK of the array", function () {

        var that = this;
        var dummy1 = jasmine.createSpy("dummy1");
        var dummy2 = jasmine.createSpy("dummy2").and.callFake(function () {
            that.mediator.removeEventListener("click", dummy4);
            that.mediator.removeEventListener("click", dummy2);
        });
        var dummy3 = jasmine.createSpy("dummy3");
        var dummy4 = jasmine.createSpy("dummy4");
        var dummy5 = jasmine.createSpy("dummy5");


        this.mediator.addEventListener("click", dummy1);
        this.mediator.addEventListener("click", dummy2);
        this.mediator.addEventListener("click", dummy3);
        this.mediator.addEventListener("click", dummy4);
        this.mediator.addEventListener("click", dummy5);
        this.mediator.dispatchEvent("click");
        expect(dummy1.calls.count()).toBe(1);
        expect(dummy2.calls.count()).toBe(1);
        expect(dummy3.calls.count()).toBe(1);
        expect(dummy4.calls.count()).toBe(0);
        expect(dummy5.calls.count()).toBe(1);

    });

    it("should not skip over event handlers, if we remove MULTIPLE handlers from the FRONT of the array", function () {

        var that = this;
        var dummy1 = jasmine.createSpy("dummy1");
        var dummy2 = jasmine.createSpy("dummy2");
        var dummy3 = jasmine.createSpy("dummy3").and.callFake(function () {
            that.mediator.removeEventListener("click", dummy1);
            that.mediator.removeEventListener("click", dummy2);
            that.mediator.removeEventListener("click", dummy3);
        });
        var dummy4 = jasmine.createSpy("dummy4");
        var dummy5 = jasmine.createSpy("dummy5");


        this.mediator.addEventListener("click", dummy1);
        this.mediator.addEventListener("click", dummy2);
        this.mediator.addEventListener("click", dummy3);
        this.mediator.addEventListener("click", dummy4);
        this.mediator.addEventListener("click", dummy5);
        this.mediator.dispatchEvent("click");
        expect(dummy1.calls.count()).toBe(1);
        expect(dummy2.calls.count()).toBe(1);
        expect(dummy3.calls.count()).toBe(1);
        expect(dummy4.calls.count()).toBe(1);
        expect(dummy5.calls.count()).toBe(1);

    });

});