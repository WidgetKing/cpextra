/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 28/03/16
 * Time: 9:19 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for SlideObjectEnterExitEventManager", function () {

    "use strict";

    function createEvent(name) {
        return new unitTests.classes.CustomEvent(name);
    }


    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "eventManager":{
                "events":{
                    "ENTER":"enter",
                    "EXIT":"exit"
                }
            }
        };

        // Mock objects
        this.slideObject = new unitTests.classes.EventDispatcher();
        spyOn(this.slideObject, "dispatchEvent");
        this.slideObjectState = new unitTests.classes.EventDispatcher();
        this.slideObjectState.isInitialized = false;

        // Test instance
        this.instance = new _extra.classes.SlideObjectEnterExitEventManager(this.slideObject);
        this.instance.setCurrentDispatcher(this.slideObjectState);
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should respond to the initialized event", function () {
        this.slideObjectState.dispatchEvent(createEvent("internalinitialization"));
        expect(this.slideObject.dispatchEvent).toHaveBeenCalledWith(_extra.eventManager.events.ENTER);
    });

    it("should allow us to swap dispatchers", function () {

        var newDispatcher = new unitTests.classes.EventDispatcher();
        newDispatcher.isInitialized = false;

        this.instance.setCurrentDispatcher(newDispatcher);

        // Test old dispatcher no longer works
        this.slideObjectState.dispatchEvent(createEvent("internalinitialization"));
        expect(this.slideObject.dispatchEvent).not.toHaveBeenCalled();

        // Test new dispatcher works
        newDispatcher.dispatchEvent(createEvent("internalinitialization"));
        expect(this.slideObject.dispatchEvent).toHaveBeenCalledWith(_extra.eventManager.events.ENTER);

    });

    it("should not dispatch 'enter' twice if an 'exit' hasn't been called", function () {

        this.slideObjectState.dispatchEvent(createEvent("internalinitialization"));
        expect(this.slideObject.dispatchEvent).toHaveBeenCalledWith(_extra.eventManager.events.ENTER);

        // Clear, try again
        this.slideObject.dispatchEvent.calls.reset();

        this.slideObjectState.dispatchEvent(createEvent("internalinitialization"));
        expect(this.slideObject.dispatchEvent).not.toHaveBeenCalled();

    });

    it("should not call 'exit' before 'enter' is called", function () {

        this.slideObjectState.dispatchEvent(createEvent("internalunload"));
        expect(this.slideObject.dispatchEvent).not.toHaveBeenCalled();

        this.slideObjectState.dispatchEvent(createEvent("internalinitialization"));
        expect(this.slideObject.dispatchEvent).toHaveBeenCalledWith(_extra.eventManager.events.ENTER);

        this.slideObjectState.dispatchEvent(createEvent("internalunload"));
        expect(this.slideObject.dispatchEvent).toHaveBeenCalledWith(_extra.eventManager.events.EXIT);

    });

    it("should not call 'enter' if the slide object was initialized before the proxy was created", function () {

        // Unsetup setup
        this.instance.setCurrentDispatcher(null);
        this.slideObjectState.isInitialized = true;
        this.instance.setCurrentDispatcher(this.slideObjectState);


        this.slideObjectState.dispatchEvent(createEvent("internalinitialization"));
        expect(this.slideObject.dispatchEvent).not.toHaveBeenCalled();

        this.slideObjectState.dispatchEvent(createEvent("internalunload"));
        expect(this.slideObject.dispatchEvent).toHaveBeenCalledWith(_extra.eventManager.events.EXIT);

    });
});