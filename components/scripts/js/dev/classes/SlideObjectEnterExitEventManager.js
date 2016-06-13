/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 28/03/16
 * Time: 9:17 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("SlideObjectEnterExitEventManager", function () {

    "use strict";

    function SlideObjectEnterExitEventManager(slideObjectProxy) {

        var isInitialized = false;

        function initializationHandler() {
            // If statement to prevent multiple start events.
            if (!isInitialized) {
                slideObjectProxy.dispatchEvent(_extra.eventManager.events.ENTER);
                isInitialized = true;
            }
        }

        function unloadHandler() {
            if (isInitialized) {
                slideObjectProxy.dispatchEvent(_extra.eventManager.events.EXIT);
                isInitialized = false;
            }
        }

        this.setCurrentDispatcher = function (dispatcher) {

            // If we're swapping to the current dispatcher, then forget it.
            if (this.dispatcher === dispatcher) {
                return;
            // If we already have a dispatcher, then stop listening to it.
            } else if (this.dispatcher) {
                this.dispatcher.removeEventListener("internalinitialization", initializationHandler);
                this.dispatcher.removeEventListener("internalunload", unloadHandler);
            }

            // Make the replacement
            this.dispatcher = dispatcher;

            // If we haven't been given a null dispatcher, start listening to it.
            if (this.dispatcher) {
                isInitialized = this.dispatcher.isInitialized;
                this.dispatcher.addEventListener("internalinitialization", initializationHandler);
                this.dispatcher.addEventListener("internalunload", unloadHandler);
            }
        };

    }

    _extra.registerClass("SlideObjectEnterExitEventManager", SlideObjectEnterExitEventManager);

});