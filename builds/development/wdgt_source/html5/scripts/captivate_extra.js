/*global _extra*/
/** global
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/09/15
 * Time: 9:00 AM
 * To change this template use File | Settings | File Templates.
 */

(function () {

    "use strict";

    ////////////////////////////////
    //////// INIT
    ////////////////////////////////

    window._extra = {};
    _extra.X = {};

    // There's not a whole lot we can do at the moment until we can access the internals of Captivate
    // The first step is to find the window object of the main Captivate project
    // The window object we access here is for the widget (which is loaded in an iFrame and treated as another
    // web page)
    function getCaptivateMainWindow(w) {

        // If this is the first time we call this method, then we'll check the current window
        if (!w) w = window;

        // Loop up the windows until we find the magical cp object.
        if (w.hasOwnProperty("cp")) return w;
        else return getCaptivateMainWindow(w.parent);
    }

    // Assign the main Captivate window object to our private w object
    _extra.w = getCaptivateMainWindow();
    // Expose the Captivate Extra library for use on the main window scope.
    _extra.w.X = _extra.X;

    //////////////////////////////////
    //////// Private API Methods
    //////////////////////////////////

    //////////////////////////////////
    //////// Public API Methods
    //////////////////////////////////

    /**
     * Sends a message to the debug console of the browser, assuming the console is available.
     * @param message
     */
    _extra.X.log = function (message) {
        if (console) {
            console.log(message);
        }
    };

    _extra.X.log("Hello World: " + window.hasOwnProperty("$"));

} () );
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/09/15
 * Time: 9:02 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    window._extra.variableManager = {};
} () );