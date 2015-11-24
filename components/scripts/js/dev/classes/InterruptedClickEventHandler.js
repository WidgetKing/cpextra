/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/11/15
 * Time: 4:10 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("InterruptedClickEventHandler", function () {

    "use strict";

    function InterruptedClickEventHandler(eventDispatcher) {

        var stateChanged = false,
            heardMouseDown = false;

        ///////////////////////////////////////////////////////////////////////
        /////////////// Event Handlers
        ///////////////////////////////////////////////////////////////////////
        function onMouseDown() {
            heardMouseDown = true;
        }

        function onMouseUp(event) {
            if (stateChanged && heardMouseDown) {

                // If we have a mouse down state, that means that the click event will not be fired automatically.
                // So we have to fake it.
                switch (event.button) {
                    case 0 :
                        eventDispatcher.dispatchEvent(_extra.eventManager.events.CLICK);
                        break;

                    case 2:
                        eventDispatcher.dispatchEvent(_extra.eventManager.events.RIGHT_CLICK);
                        break;

                    default :
                        break;
                }
            }

            stateChanged = false;
            heardMouseDown = false;
        }

        function documentMouseUp() {
            stateChanged = false;
            heardMouseDown = false;
        }

        ///////////////////////////////////////////////////////////////////////
        /////////////// Public Methods
        ///////////////////////////////////////////////////////////////////////
        this.stateHasChanged = function () {
            stateChanged = true;
        };

        this.unload = function () {
            eventDispatcher.removeEventListener("mousedown", onMouseDown);
            eventDispatcher.removeEventListener("mouseup", onMouseUp);
            _extra.w.document.removeEventListener("mouseup", documentMouseUp)
        };

        eventDispatcher.addEventListener("mousedown", onMouseDown);
        eventDispatcher.addEventListener("mouseup", onMouseUp);
        _extra.w.document.addEventListener("mouseup", documentMouseUp);
    }

    _extra.registerClass("InterruptedClickEventHandler", InterruptedClickEventHandler);

});