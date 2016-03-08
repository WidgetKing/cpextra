/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 2:29 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("DoubleClickHandler", function () {

    "use strict";

    ///////////// This class assumes only one click handler and one double click handler
    ///////////// EventMediator should ensure only one callback is sent here for those times of functions.
    function DoubleClickHandler() {

        ///////////////////////////////////////////////////////////////////////
        /////////////// PRIVATE VARIABLES
        ///////////////////////////////////////////////////////////////////////
        var activeTimeoutId,
            singleClickCount = 0,
            singleClickCallback,
            doubleClickCallback,
            rightClickCallback;


        ///////////////////////////////////////////////////////////////////////
        /////////////// PRIVATE FUNCTIONS
        ///////////////////////////////////////////////////////////////////////
        function singleClickHandler(event) {

            if (singleClickCallback) {

                // No need to delay the callback
                if (_extra.preferences.doubleClickDelay <= 0 || !doubleClickCallback) {

                    singleClickCallback(event);

                } else {

                    singleClickCount += 1;

                    if (!activeTimeoutId) {

                        // This is the FIRST click.

                        // We need to delay the callback to ensure this is a click and not the early
                        // signs of a double click
                        activeTimeoutId = _extra.w.setTimeout(function () {

                            if (singleClickCount >= 2) {

                                // We were clicked twice during the period, even though that didn't cause a double-click
                                doubleClickCallback(event);

                            } else {

                                // Enough time has passed since the first click and there has been no second click
                                // We can call the callback safely
                                singleClickCallback(event);

                            }

                            // Reset
                            singleClickCount = 0;
                            activeTimeoutId = null;

                        }, _extra.preferences.doubleClickDelay);


                    }

                    // If a second single click comes through here while the timeout is active we will record it.

                }


            }


        }

        function doubleClickHandler(event) {

            if (doubleClickCallback) {

                if (activeTimeoutId) {

                    _extra.w.clearTimeout(activeTimeoutId);
                    activeTimeoutId = null;
                    singleClickCount = 0;

                }

                doubleClickCallback(event);

            }

        }

        function rightClickHandler(event) {

            rightClickCallback(event);
            event.preventDefault();

        }

        ///////////////////////////////////////////////////////////////////////
        /////////////// PUBLIC FUNCTIONS
        ///////////////////////////////////////////////////////////////////////

        this.addEventHandler = function(event, callback) {

            switch (event) {

                case _extra.eventManager.events.CLICK :
                    singleClickCallback = callback;
                    return singleClickHandler;

                case _extra.eventManager.events.DOUBLE_CLICK :
                    doubleClickCallback = callback;
                    return doubleClickHandler;

                case _extra.eventManager.events.RIGHT_CLICK :
                    rightClickCallback = callback;
                    return rightClickHandler;

            }

            // If we get here, then the event is not dealing with something important to us.
            // Return the default callback.
            return callback;

        };

        this.removeEventHandler = function(event) {

            if (event === _extra.eventManager.events.CLICK) {

                singleClickCallback = null;

            } else if (event === _extra.eventManager.events.DOUBLE_CLICK) {

                doubleClickCallback = null;

            }

        };

    }

    _extra.registerClass("DoubleClickHandler", DoubleClickHandler);

});