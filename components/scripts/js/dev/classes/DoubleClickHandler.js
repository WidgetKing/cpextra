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
            doubleClickCallback;


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
                        activeTimeoutId = setTimeout(function () {

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

                    clearTimeout(activeTimeoutId);
                    activeTimeoutId = null;
                    singleClickCount = 0;

                }

                doubleClickCallback(event);

            }

        }

        ///////////////////////////////////////////////////////////////////////
        /////////////// PUBLIC FUNCTIONS
        ///////////////////////////////////////////////////////////////////////

        this.addEventHandler = function(event, callback) {

            if (event === "click") {

                singleClickCallback = callback;
                return singleClickHandler;

            } else if (event === "dblclick") {

                doubleClickCallback = callback;

                return doubleClickHandler;

            }

            // If we get here, then the event is not dealing with something important to us.
            // Return the default callback.
            return callback;

        };

        this.removeEventHandler = function(event) {

            if (event === "click") {

                singleClickCallback = null;

            } else if (event === "dblclick") {

                doubleClickCallback = null;

            }

        };

    }

    _extra.registerClass("DoubleClickHandler", DoubleClickHandler);

});