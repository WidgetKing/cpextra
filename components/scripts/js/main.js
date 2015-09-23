
/** global
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/09/15
 * Time: 9:00 AM
 * To change this template use File | Settings | File Templates.
 */
        // The internal Captivate Extra Object.
var _extra = {};

(function () {

    "use strict";

    ////////////////////////////////
    //////// Private Members
    ////////////////////////////////

    // Object used to track which components want a function to be called when the movie is loaded.
    var onFullyLoadedCallbacks = [];

    ////////////////////////////////
    //////// INIT
    ////////////////////////////////
    _extra.X = {};

    // This function is used by other files who want to add their functionality to Captivate Extra.
    // If it turns out we want to abort creating Captivate Extra because it's already been defined, then this will
    // prevent the component from executing.
    _extra.initComponent = function (component) {

        if (!_extra.hasBeenDefined) {

            var result = component();

            if (result) {
                onFullyLoadedCallbacks.push(result);
            }

        }

    };

    // There's not a whole lot we can do at the moment until we can access the internals of Captivate
    // The first step is to find the window object of the main Captivate project
    // The window object we access here is for the widget (which is loaded in an iFrame and treated as another
    // web page)
    function getCaptivateMainWindow(w) {

        // If this is the first time we call this method, then we'll check the current window
        if (!w) {
            w = window;
        }

        // Loop up the windows until we find the magical cp object.
        if (w.hasOwnProperty("cp")) {
            return w;
        } else {
            return getCaptivateMainWindow(w.parent);
        }
    }

    // Assign the main Captivate window object to our private w object
    _extra.w = getCaptivateMainWindow();

    if (_extra.w.X) {
        // The Captivate Extra library has already been defined. We will not duplicate it.
        _extra.hasBeenDefined = true;
        return;
    } else {
        _extra.hasBeenDefined = false;
        // Expose the Captivate Extra library for use on the main window scope.
        _extra.w.X = _extra.X;
    }









    //////////////////////////////////
    //////// Internal API Methods
    //////////////////////////////////

    // Object holds all the classes we use internally.
    _extra.classes = {};

    //
    _extra.registerClass = function (name, classFunction) {
        _extra.classes[name] = classFunction;
    };

    _extra.cp = _extra.w.cp;

    window.CaptivateExtraWidgetInit = function () {
        // Captivate is expecting to call this function because it's set up in the widget OAM as the widget's 'init'
        // method.
        // We define this function so as to prevent any potential errors.
        onFullyLoaded();
    };




    //////////////////////////////////
    //////// Public API Methods
    //////////////////////////////////

    /**
     * The current version of Captivate Extra
     * @type {string}
     */
    _extra.X.version = "0.0.2";

    /**
     * The current Captivate version
     * @type {*}
     */
    _extra.X.captivateVersion = _extra.w.CaptivateVersion;

    /**
     * Sends a message to the debug console of the browser, assuming the console is available.
     * @param message
     */
    _extra.X.log = function (message) {
        if (console) {
            console.log(message);
        }
    };

    /**
     * The raw Captivate Data object.
     *
     * State based functions:
     * - BringBaseItemToFrontWithinState(c,b)
     * - GetBaseItemsInAllStates(c,b)
     * - GetMouseOverManager()
     * - _changeState*c,b,d,e,f)
     * - _hideCurrentState(c)
     * - _showCurrentState(c)
     * - changeState(c,b,d,e)
     * - doesSupportStates(c)
     * - getBaseStateItem(c)
     * - getCurrentStateObjectForItem(a)
     * - getDisplayObjByCP_UID(c)
     * - getDisplayObjByKey(c)
     * - getDisplayObjNameByCP_UID(c)
     * - getInfoForStateChange(c,b)
     * - getLocalisedStateName(c)
     * - getOffsetPosition(c,b)
     * - getParentStateObjectForItem(c)
     * - getStateName(a,b)
     * - goToNextState(c)
     * - goToPreviousState(c)
     * - hasStateOfType(a,b)
     * - isBaseItemInState(a)
     * - isInbuiltState(a)
     * @type {*}
     */
    _extra.X.cp = _extra.cp;

    /**
     * The 'cpInterface' property is a reference to captivate's cpAPIInterface (which is available from the window scope).
     *
     * Public methods include
     * - canNavigateToTime
     * - canPlay
     * - fastForward
     * - getCurrentDeviceMode
     * - getCurrentFrame
     * - getCurrentSlideIndex
     * - getDurationInFrames
     * - getDurationInSeconds
     * - getEventEmitter (For captivate enter exit slide events?)
     * - getPlaySpeed
     * - getVariableValue() - Pass in the name of the Captivate Variable. Function returns the value
     * - getVolume
     * - gotoSlide
     * - isSWFOrHTMLContent
     * - navigateToTime
     * - next
     * - pause
     * - play
     * - previous
     * - rewind
     * - setAllowForceQuitContainer
     * - setVariableValue
     * - setVolume
     */
    _extra.X.cpInterface = _extra.w.cpAPIInterface;

    /**
     * The location of the Captivate Variables.
     * @type {*}
     */
    _extra.X.cpVariables = _extra.w;





    //////////////////////////////////
    //////// Private Methods
    //////////////////////////////////
    function onFullyLoaded() {

        /////////////////
        ////// ENTRY POINT
        /////////////////
        for (var i = 0; i < onFullyLoadedCallbacks.length; i += 1) {

            onFullyLoadedCallbacks[i]();

        }

        // Now that the callbacks have been called, we can unload those functions from memory.
        onFullyLoadedCallbacks = null;

        // Begin inspecting Captivate movie elements

        /////////// INSPECT VARIABLES



    }



    ////////////////// TEST PIT
    // Should be deleted before making a production version

    // There is potential we will need to listen to this event if the widget is loaded on the first frame of the movie
    /*window.addEventListener("moduleReadyEvent", function () {
        _extra.X.log("Module Ready Event Fired");
    });*/

} () );