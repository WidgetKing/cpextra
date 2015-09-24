
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

    /**
     * Sends a message to the debug console of the browser, assuming the console is available.
     * @param message
     */
    _extra.log = function (message) {
        if (console) {
            console.log(message);
        }
    };

    _extra.error = function (message) {
        if (console) {
            console.error(message);
        }
    };

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
        _extra.error("Captivate Extra has already been defined and set up (Or the global 'X' variable has been used by another " +
                "script) This could be caused by having multiple Captivate Extra widgets in your project." +
                "This is not best practice. Please only use a single Captivate Extra widget.");
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
     * The number of this build of Captivate Extra.
     * @type {string}
     */
    _extra.X.buildNumber = "39";

    /**
     * The current Captivate version
     * @type {*}
     */
    _extra.X.captivateVersion = _extra.w.CaptivateVersion;

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
/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/09/15
 * Time: 9:02 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.initComponent(function () {
    "use strict";

    //////////////////////////
    /////// Private Variables
    //////////////////////////
    var variablePrefixCallbacks = {};


    //////////////////////////
    ////// Component Setup
    //////////////////////////
    window._extra.variableManager = {};
    window._extra.variableManager.registerVariablePrefixCallback = function (prefix, callback) {

        if (!variablePrefixCallbacks[prefix]) {
            variablePrefixCallbacks[prefix] = [];
        }

        variablePrefixCallbacks[prefix].push(callback);
    };

    ///////////////////////////
    //////// Public Methods
    ///////////////////////////
    /**
     * Changes the value of a Captivate Variable. This is the safest method of doing this, as Captivate Extra tickers
     * a lot with variables, it wants to know in advance when they are changed. This function will ensure they are
     * always updated in an acceptable manner.
     * @param variableName The name of the variable to be updated
     * @param value The value to assign said variable
     */
    _extra.X.setVariableValue = function (variableName, value) {
        _extra.X.cpInterface.setVariableValue(variableName, value);
    };

    /**
     * Gives you the value of a Captivate Variable. This is the safest method of doing this, as Captivate Extra tickers
     * a lot with variables behind the scenes. Captivate Extra wants to be notified whenever a variable is accessed.
     * This function will ensure the correct value is returned.
     * @param variableName The name of the variable whose value you want returned
     */
    _extra.X.getVariableValue = function (variableName) {
        return _extra.X.cpInterface.getVariableValue(variableName);
    };


    // Function which is called when the movies has been loaded
    return function () {

        var captivateVariables = _extra.cp.variablesManager.varInfos,
            varInfo,
            varName,
            varNameSplitArray,
            varPrefix,
            i, j;

        for (i = 0; i < captivateVariables.length; i += 1) {

            varInfo = captivateVariables[i];

            if (!varInfo.systemDefined) {
                // This is a user variable

                varName = varInfo.name;
                varNameSplitArray = varName.split("_");
                varPrefix = varNameSplitArray[0];

                // To support all variables as having an underscore '_' in front of their name
                // we'll check if the first index is empty (as would be true in a variable name such as _ls_myVariable)
                // If so, we'll use the second index as the variable's prefix (in that example it would be 'ls')
                if (varPrefix === "") {
                    varPrefix = varNameSplitArray[1];
                }

                // If someone has added a callback for this kind of prefix.
                if (variablePrefixCallbacks[varPrefix]) {

                    // varInfo now becomes the variable to hold the array of callbacks.
                    varInfo = variablePrefixCallbacks[varPrefix];

                    // Loop through all callbacks and send them the name of the variable they want.
                    for (j = 0; j < varInfo.length; j += 1) {

                        varInfo[j](varName);

                    }

                }


            }

        } // End of looping through Captivate Variables.

        // All relevant callbacks called. We can unload this information now.
        variablePrefixCallbacks = null;

    };
});
/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 12:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.initComponent(function () {

    "use strict";

    var storageVariables;

    function saveStorageVariables() {
        var storageVariableInfo,
            variableName;

        for (variableName in storageVariables) {

            if (storageVariables.hasOwnProperty(variableName)) {

                storageVariableInfo = storageVariables[variableName];
                storageVariableInfo.storage.setItem(variableName,
                                                    _extra.X.getVariableValue(variableName));

            }

        }

    }

    function initializeStorageVariables() {
        storageVariables = {};

        // Save the storage variables when the window closes.
        _extra.w.addEventListener("unload", saveStorageVariables);
    }



    function setUpStorageVariable(variableName, storage) {

        // Initialize Storage Variables
        if (!storageVariables) {
            initializeStorageVariables();
        }

        // Check Storage
        var storageValue = storage.getItem(variableName);
        if (storageValue) {

            // If this item can be of a number type, then write it to the variable as a number type.
            if (!isNaN(storageValue)) {
                storageValue = parseFloat(storageValue);
            }



            // We do have a valid value in storage
            _extra.X.setVariableValue(variableName, storageValue);
        }

        // Save this variable to our records so that we can save its value to storage at the appropriate time.
        storageVariables[variableName] = {
            "storage": storage
        };
    }

    setTimeout(saveStorageVariables,4000);

    // Tap into the variable manager's callbacks. This is how we are notified of variables.
    _extra.variableManager.registerVariablePrefixCallback("ls", function (variableName) {
        setUpStorageVariable(variableName, _extra.w.localStorage);
    });

    _extra.variableManager.registerVariablePrefixCallback("ss", function (variableName) {
        setUpStorageVariable(variableName, _extra.w.sessionStorage);
    });
});