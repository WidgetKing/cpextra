/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/11/15
 * Time: 4:10 PM
 * To change this template use File | Settings | File Templates.
 */

_extra.registerModule("InterruptedClickEventHandler", function () {

    "use strict";

    /**
     * This is an object to manage the click event on mobile devices.
     *
     * Originally it was to manage click events when jumping between different states, as the divs would change.
     *
     * However that is no longer the case, so this object only works for mobile now.
     */
    function InterruptedClickEventHandler(eventDispatcher, name) {

        var stateChanged = false,
            heardMouseDown = false,
            timeSinceFirstClick = null;

        function init() {
            if (_extra.eventManager.useTouchEvents) {

                eventDispatcher.addEventListener(_extra.eventManager.events.MOUSE_DOWN, onMouseDown);
                eventDispatcher.addEventListener(_extra.eventManager.events.MOUSE_UP, onMouseUp);

                _extra.w.document.addEventListener(_extra.eventManager.events.MOUSE_UP, documentMouseUp);

            }
        }

        ///////////////////////////////////////////////////////////////////////
        /////////////// Event Handlers
        ///////////////////////////////////////////////////////////////////////
        function onMouseDown() {
            heardMouseDown = true;
        }

        function onMouseUp(event) {

            if (heardMouseDown) {

                // If we have a mouse down state, that means that the click event will not be fired automatically.
                // So we have to fake it.
                switch (event.button) {

                    // LEFT CLICK
                    case undefined :
                    case 0 :
                        manageLeftClick();
                        break;

                    // Initially we used this because we were using the 'rightclick' event to detect right click.
                    // Later however, we found that 'rightclick' works almost exclusively in Chrome. Other browsers use
                    // 'contextmenu', which dispatches the event when a context menu should appear (right click).
                    // Turns out, that event doesn't need the complicated click detecting that 'rightclick' does.
                    // So we've commented out the below code. If however, in the future we need to use 'rightclick' again
                    // uncommenting the code bellow should make it work.
                    //case 2:
                    //    eventDispatcher.dispatchEvent(_extra.eventManager.events.RIGHT_CLICK);
                    //    break;

                    default :
                        break;
                }
            }

            heardMouseDown = false;
        }

        function documentMouseUp() {
            heardMouseDown = false;
        }

        ///////////////////////////////////////////////////////////////////////
        /////////////// Managers
        ///////////////////////////////////////////////////////////////////////
        function manageLeftClick() {

            var currentTime = new _extra.w.Date();
            eventDispatcher.dispatchEvent(_extra.eventManager.events.CLICK);


            // THIS IS THE SECOND CLICK
            // If there was a first click AND it was within the expected time of a double click.
            if (timeSinceFirstClick !== null && isWithinDoubleClickDelay(currentTime)) {

                eventDispatcher.dispatchEvent(_extra.eventManager.events.DOUBLE_CLICK);
                // Set this to null so we can't get a 'triple click'
                timeSinceFirstClick = null;

                // THIS IS THE FIRST CLICK
            } else {

                timeSinceFirstClick = currentTime;

            }

        }

        function isWithinDoubleClickDelay(currentTime) {
            return currentTime.getTime() - timeSinceFirstClick.getTime() <= _extra.preferences.doubleClickDelay;
        }

        ///////////////////////////////////////////////////////////////////////
        /////////////// Public Methods
        ///////////////////////////////////////////////////////////////////////

        this.unload = function () {
            if (_extra.eventManager.useTouchEvents) {
                eventDispatcher.removeEventListener(_extra.eventManager.events.MOUSE_DOWN, onMouseDown);
                eventDispatcher.removeEventListener(_extra.eventManager.events.MOUSE_UP, onMouseUp);
                _extra.w.document.removeEventListener(_extra.eventManager.events.MOUSE_UP, documentMouseUp);
            }
        };

        init();
    }

    _extra.registerClass("InterruptedClickEventHandler", InterruptedClickEventHandler);

});