/*
 * Copyright 2015 Tristan Ward
 *
 * CP BUDDY may be used for free in any kind of project.
 * The CP BUDDY library may not be sold for profit or passed off as your own work.
 */
// Wrap library in a anonymous function so as not to clutter up the global scope.
(function(){

    // Wait until captivate has initialized
    window.addEventListener("moduleReadyEvent",cpBuddyInit);

    window.CaptivateExtraWidgetInit = function() {
        alert("Captivate Widget");
        // Currently this function is only here to avoid causing errors.
    };

    function cpBuddyInit() {

        // As the movie has now been initialized, remove the event listener to avoid initiating cpBuddy twice.
        // Not likely to happen, but you can never be too careful.
        // Unless you're agoraphobic.
        window.removeEventListener("moduleReadyEvent",cpBuddyInit);

        /**
         * The base object of the API.
         *
         * Holds all the variables and functions used by cpBuddy
         */
        window.cpBuddy = {
            /**
             * Version of CP Buddy
             */
            "version":"0.1",
            /**
             * Version of Captivate
             */
            "captivateVersion":window.CaptivateVersion,
            /**
             * Method to notify the Captivate Author of an error
             * @param message
             */
            "error":function(message){
                if (console && console.error) {
                    console.error([message]);
                } else {
                    alert(message);
                }
            },
            /**
             * The 'cp' property is a reference to captivate's cpAPIInterface (which is available from the window scope).
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
            "cpInterface":window.cpAPIInterface,
            /**
             * Location of the Captivate Variables.
             */
            "cpVariables":window,
            /**
             * Location of the raw CP data
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
             */
            "cp":window.cp,
            /**
             * Another interesting object that I haven't completely explored yet.
             *
             * Put it here because it has a 'lastFrame' property.
             */
            "stage":window.cp.movie.stage,
            /**
             * Full on data for how the captivate project will run.
             *
             * Awe-some.
             *
             *
             */
            "projectData":window.cp.model,
            /**
             * List of slide data
             */
            "slideData":[],
            /**
             * List of slide labels
             */
            "slideLabels":[],
            /**
             * You can access the slide data from the cpBuddy.slideData list easily if you know what the slide number is.
             *
             * If on the other hand you only know the label it's not so easy.
             *
             * Fortunately this function allows you to do that. Just pass the slide label into the function and it will
             * return you the data for that slide!
             * @param slideLabel name of slide
             * @returns {*} slide data. returns null if couldn't find a slide with that label.
             */
            "getSlideDataByLabel":function(slideLabel){
                // TODO: Optimise with forEach()
                for (var i = 0; i < cpBuddy.slideLabels.length; i++) {

                    if (cpBuddy.slideLabels[i] === slideLabel) {
                        return cpBuddy.slideData[i];
                    }

                }
                return null;
            },
            /**
             * The object on which captivate dispatches its custom events on.
             *
             * A list of custom captivate events can be found on the cpBuddy.events object.
             */
            "eventDispatcher":window.cpAPIEventEmitter,

            /**
             * This object controls a number of Captivate behaviour changes that cpBuddy manually 'corrects'.
             * These may be certain bugs, or unexpected behaviour.
             * By default most of these are on, but they may be turned off by interacting with this API.
             */
            "behaviourChanges":{
                /**
                 * There is a bug in Captivate where when you exit a slide and it's not on the last frame, then the
                 * on slide exit action is not triggered. cpBuddy fixes this bug. However, if this is not the intended
                 * behaviour for the project, then this variable can be set to false in it will prevent the behaviour.
                 */
                        // TODO: Implement this. Need a lastFrame variable for it to work.
                "executeSlideExitActionWhenNotOnLastFrame":true
            },
            /**
             * A list of custom events that captivate dispatches on the cpAPIEventEmitter object (Also accessible from
             * cpBuddy.eventDispatcher).
             *
             * These variables can be passed into the eventListener function like so:
             *
             * <example>
             *     cpBuddy.eventListener.addEventListener(cpBuddy.events.SLIDE_ENTER, function (eventData) {
             *         alert("Entered slide: " + eventData.slideNumber);
             *     }
             * </example>
             *
             * All events
             * b.VARIABLE_CREATED_EVENT = 0;
                 b.VARIABLE_CHANGED_EVENT = 1;
                 b.SPECIFIC_VARIABLE_CHANGED_EVENT = 2;
                 b.SLIDEENTEREVENT = 3;
                 b.SLIDEEXITEVENT = 4;
                 b.INTERACTIVEITEMSUBMITEVENT = 5;
                 b.MOVIEPAUSEEVENT = 6;
                 b.MOVIERESUMEEVENT = 7;
                 b.MOVIESTARTEVENT = 8;
                 b.MOVIESTOPEVENT = 9;
                 b.QUESTIONSKIPEVENT = 10;
                 b.QUESTIONSUBMITEVENT = 11;
                 b.STARTPLAYBARSCRUBBINGEVENT = 12;
                 b.ENDPLAYBARSCRUBBINGEVENT = 13;
                 b.MOVIEFOCUSINEVENT = 14;
                 b.MOVIEFOCUSLOSTEVENT = 15;
                 b.MOVIEAUDIOMUTEEVENT =
                     16;
                 b.INPUTCONTROLREPLACEDEVENT = 17;
                 b.WINDOWRESIZEDEVENT = 18;
                 b.WINDOWRESIZECOMPLETEDEVENT = 19;
                 b.ORIENTATIONCHANGEDEVENT = 20;
                 b.ORIENTATIONCHANGECOMPLETEDEVENT = 21;
                 b.TIMEUPDATEEVENT = 22;
                 b.SET_RESUMEDATA = 23;
                 b.PLAYBARSTATECHANGED = 24;
                 b.TOCSTATECHANGED = 25;
                 b.ITEMDRAWINGCOMPLETEEVENT = 26;
                 b.MOVIEEXITEVENT = 27;
                 b.QUIZSLIDEREACHED = 28;
             */
            "events":{
                /**
                 * Event Data:
                 * - slideNumber
                 * - frameNumber
                 * - lcpversion (?)
                 */
                "SLIDE_ENTER":"CPAPI_SLIDEENTER",
                /**
                 * Event Data:
                 * - slideNumber
                 * - frameNumber
                 * - lcpversion (?)
                 * - percentageSlideSeen = NUMBER
                 */
                "SLIDE_EXIT":"CPAPI_SLIDEEXIT",
                "PLAYBAR_SCRUBBING_BEGIN":"CPAPI_STARTPLAYBARSCRUBBING",
                "PLAYBAR_SCRUBBING_END":"CPAPI_ENDPLAYBARSCRUBBING",
                /**
                 * Event Data:
                 * - frameNumber
                 * - includedInQuiz
                 * - issuccess
                 * - itemname
                 * - objecttype
                 * - questioneventdata
                 * - slideNumber
                 */
                "INTERACTIVE_ITEM_SUBMIT":"CPAPI_INTERACTIVEITEMSUBMIT",
                "MOVIE_PAUSE":"CPAPI_MOVIEPAUSE",
                "MOVIE_RESUME":"CPAPI_MOVIERESUME",
                "MOVIE_START":"CPAPI_MOVIESTART",
                "MOVIE_STOP":"CPAPI_MOVIESTOP",
                /**
                 * Event Data:
                 * - correctAnswer=STRING;
                 * - infiniteAttempts=BOOLEAN;
                 * - interactionID=NUMBER;
                 * - objectiveID=STRING;
                 * - questionAnswered=BOOLEAN;
                 * - questionAnsweredCorrectly=BOOLEAN;
                 * - questionAttempts=NUMBER;
                 * - questionMaxAttempts=NUMBER;
                 * - questionMaxScore=NUMBER;
                 * - questionNumber=NUMBER;
                 * - questionScore=NUMBER;
                 * - questionScoringType=[object Object],{Name:STRING};
                 * - questionType=STRING;
                 * - quizName=STRING;
                 * - reportAnswers=BOOLEAN;
                 * - selectedAnswer=STRING;
                 * - slideNumber=NUMBER;
                 */
                "QUESTION_SKIP":"CPAPI_QUESTIONSKIP",
                /**
                 * Event Data:
                 * - correctAnswer=STRING;
                 * - infiniteAttempts=BOOLEAN;
                 * - interactionID=NUMBER;
                 * - objectiveID=STRING;
                 * - questionAnswered=BOOLEAN;
                 * - questionAnsweredCorrectly=BOOLEAN;
                 * - questionAttempts=NUMBER;
                 * - questionMaxAttempts=NUMBER;
                 * - questionMaxScore=NUMBER;
                 * - questionNumber=NUMBER;
                 * - questionScore=NUMBER;
                 * - questionScoringType=[object Object],{Name:STRING};
                 * - questionType=STRING;
                 * - quizName=STRING;
                 * - reportAnswers=BOOLEAN;
                 * - selectedAnswer=STRING;
                 * - slideNumber=NUMBER;
                 */
                "QUESTION_SUBMIT":"CPAPI_QUESTIONSUBMIT",
                /**
                 * Subscribing to this event requires a third parameter to be passed into the eventListener method.
                 * This third parameter should be the name of the Captivate Variable you wish to listen for.
                 *
                 * Event Data:
                 * - captivateVersion=STRING;
                 * - varName=STRING;
                 * - oldVal=STRIN;
                 * - newVal=STRING;
                 */
                "VARIABLE_VALUE_CHANGED":"CPAPI_VARIABLEVALUECHANGED"
            },
            "slideObjectTypeIDs":{
                "CLOSE_PATH":4,
                "CLICK_BOX":13,
                "HIGHLIGHT_BOX":14,
                "CAPTION":19,
                "TEXT_ENTRY_BOX":24,
                "TEXT_ENTRY_BOX_SUBMIT_BUTTON":75,
                "BUTTON":177
            },
            "classes":{
                "SlideObjectInterface":function(div,id) {

                    ////////////////////////////////////
                    ////////// Private Variables
                    ////////////////////////////////////
                    var unloadMethods = [];
                    var listeningForMouseOverOn = null;
                    var listeningForMouseDownOn = null;
                    var down = false;
                    var over = false;
                    var t = this;
                    var stateRelationships = {};
                    var variableListeners = {};
                    var previousNonLinkedState = "Normal";
                    var x, y, width, height;



                    ////////////////////////////////////
                    ////////// Public Variables
                    ////////////////////////////////////
                    this.id = id;
                    this.cpKey = cpBuddy.projectData.data[this.id].mdi;

                    this.initialStateData = cpBuddy.cp.getDisplayObjByKey(this.cpKey);

                    x = this.initialStateData.bounds.minX;
                    y = this.initialStateData.bounds.minY;
                    width = this.initialStateData.bounds.maxX - x;
                    height = this.initialStateData.bounds.maxY - y;

                    // The states object holds all the information of what divs belong to this object's states
                    // The code in the if statement below sets up this object
                    this.states = {};

                    cpBuddy.TEST = this;

                    // Using this if statement to set a context so as not to clutter up the SlideObjectInterface Scope.
                    if (true) {
                        var slideObjectsArray;
                        var tempFormattedStateData;
                        var tempCaptivateStateData;
                        this.initialStateData.states.forEach(function(miniStateData) {

                            slideObjectsArray = [];
                            tempFormattedStateData = {
                                "slideObjects":[]
                            };

                            for (var i = 0; i < miniStateData.stsi.length; i++) {

                                tempCaptivateStateData = cpBuddy.cp.getDisplayObjByCP_UID(miniStateData.stsi[i]);
                                tempFormattedStateData = {
                                    "upperDiv":tempCaptivateStateData.actualParent,
                                    "contentDiv":tempCaptivateStateData.element.parentNode,
                                    "data":tempCaptivateStateData,
                                    "offsetX":tempCaptivateStateData.bounds.minX - x,
                                    "offsetY":tempCaptivateStateData.bounds.minY - y
                                };

                                slideObjectsArray.push(tempFormattedStateData);

                            }

                            this.states[miniStateData.stn] = slideObjectsArray;
                        },this);
                    }



                    ////////////////////////////////////
                    ////////// Private Methods
                    ////////////////////////////////////
                    function mouseOverHandler() {

                        over = true;

                        t.removeEventListener("mouseover",mouseOverHandler);

                        if (!t.updateState()) {

                            t.addEventListener("mouseout",mouseOutHandler);

                        }
                    }

                    function mouseOutHandler() {

                        over = false;

                        t.removeEventListener("mouseout",mouseOutHandler);
                        if (!t.updateState()) {

                            t.addEventListener("mouseover",mouseOverHandler);

                        }
                    }

                    function mouseDownHandler() {

                        down = true;

                        t.removeEventListener("mousedown",mouseDownHandler);
                        if (!t.updateState()) {

                            window.addEventListener("mouseup",mouseUpHandler);

                        }
                    }

                    function mouseUpHandler() {

                        down = false;

                        window.removeEventListener("mouseup",mouseUpHandler);
                        if (!t.updateState()) {

                            t.addEventListener("mousedown",mouseDownHandler);

                        }

                    }

                    function listenForMouseOverOn(object) {

                        if (listeningForMouseOverOn !== object) {

                            if (listeningForMouseOverOn) {

                                t.removeEventListener("mouseover",mouseOverHandler);
                                t.removeEventListener("mouseout",mouseOutHandler);

                            }

                            if (object) {

                                // TODO: Detect if mouse is currently over the object.
                                if (over) {

                                    t.addEventListener("mouseout",mouseOutHandler);

                                } else {

                                    t.addEventListener("mouseover",mouseOverHandler);

                                }

                            }

                            listeningForMouseOverOn = object;

                        }
                    }

                    function listenForMouseDownOn(object) {

                        if (listeningForMouseDownOn !== object) {

                            if (listeningForMouseDownOn) {
                                t.removeEventListener("mousedown",mouseDownHandler);
                            }

                            if (object) {

                                if (down) {

                                    window.addEventListener("mouseup",mouseUpHandler);

                                } else {

                                    t.addEventListener("mousedown",mouseDownHandler);

                                }

                            }

                            listeningForMouseDownOn = object;

                        }
                    }


                    ////////////////////////////////////
                    ////////// Public Methods
                    ////////////////////////////////////
                    this.unload = function() {
                        unloadMethods.forEach(function(method) {
                            method();
                        });
                        unloadMethods = null;
                        if (listeningForMouseDownOn) {
                            listenForMouseDownOn(null);
                        }
                        if (listeningForMouseOverOn) {
                            listenForMouseOverOn(null);
                        }
                        for (var variableName in variableListeners) {
                            cpBuddy.eventDispatcher.removeEventListener(cpBuddy.events.VARIABLE_VALUE_CHANGED,variableListeners[variableName],variableName);
                        }
                        variableListeners = null;
                    };







                    ////////////////////// X
                    var setXPosition;
                    var setYPosition;
                    if (cpBuddy.isResponsiveProject) {

                        setXPosition = function (displayObjectData) {

                            // Calculate percentage
                            var n = x + displayObjectData.offsetX;
                            n = ((n / cpBuddy.projectWidth) * 100) + "%";
                            displayObjectData.upperDiv.style.left = n;
                            displayObjectData.contentDiv.style.left = n;

                            // If the stage is resized now the object will jump back to its original position
                            // So we also need to make changes to the responsive css (which is applied on resize)
                            // TODO: The author may have intentionally placed this object somewhere different on a smaller screen size. May need to account for these cases.
                            for (var responsiveCSS in displayObjectData.data.responsiveCSS) {
                                displayObjectData.data.responsiveCSS[responsiveCSS].l = n;
                            }


                        };

                        setYPosition = function (displayObjectData) {
                            var n = y + displayObjectData.offsetY;
                            n = ((n / cpBuddy.projectHeight) * 100) + "%";
                            displayObjectData.upperDiv.style.top = n;
                            displayObjectData.contentDiv.style.top = n;
                            for (var responsiveCSS in displayObjectData.data.responsiveCSS) {
                                displayObjectData.data.responsiveCSS[responsiveCSS].t = n;
                            }
                        };

                    } else {

                        // TODO: These function still do not change the location of the slide objects if set on the first frame.
                        setXPosition = function (displayObjectData) {
                            displayObjectData.upperDiv.style.left = (x + displayObjectData.offsetX) + "px";
                            displayObjectData.contentDiv.style.left = (x + displayObjectData.offsetX) + "px";
                        };

                        setYPosition = function (displayObjectData) {
                            displayObjectData.upperDiv.style.top = (y + displayObjectData.offsetY) + "px";
                            displayObjectData.contentDiv.style.top = (y + displayObjectData.offsetY) + "px";
                        };
                    }


                    this.x = function(n){

                        if (n != undefined) {

                            x = n;


                            this.currentStateInfo.forEach(setXPosition);

                        }

                        return x;
                    };

                    this.y = function(n){

                        if (n != undefined) {

                            y = n;

                            this.currentStateInfo.forEach(setYPosition);

                        }

                        return y;
                    };



                    this.setLocation = function(x,y) {
                        this.x(x);
                        this.y(y);
                    };
                    this.addEventListener = function(event,handler) {
                        this.currentStateInfo.forEach(function(stateObject){
                            stateObject.upperDiv.addEventListener(event,handler);
                        });
                    };
                    this.removeEventListener = function(event,handler) {
                        this.currentStateInfo.forEach(function(stateObject){
                            stateObject.upperDiv.removeEventListener(event,handler);
                        });
                    };
                    // TODO: Find a better name for this function, or extract the name parsing into another function
                    this.createStateEventRelationship = function(stateName) {

                        var event;
                        var variableDependency;

                        function parseEventName(name) {
                            name = name.toLowerCase();
                            // rename rollover and over to mousedown
                            if (name == "rollover" || name == "over") name = "mouseover";
                            // rename down to mouse down
                            else if (name == "down") name = "mousedown";

                            // If we have not been given a name that matches any of the events, then this is something else, probably a variableDependency
                            if (name != "mousedown" && name != "mouseover" && name != "normal") return false;
                            // It does match! YAY!
                            else return name;
                        }

                        function parseVariableName(startIndex,endIndex) {
                            var variableName = nameParts[startIndex];

                            // If we have to do some concatenation operations
                            if (startIndex != endIndex) {
                                for (var i = startIndex + 1; i < endIndex + 1; i++) {

                                    variableName += "_" + nameParts[i];

                                }
                            }

                            if (cpBuddy.cpVariables[variableName] != undefined) return variableName;
                            else {
                                cpBuddy.error("Could not work out what '" + variableName + "' in " + t.id +"'s state '" + stateName + "' is supposed to be. It is neither a variable nor an event name.");
                                return false;
                            }
                        }

                        //////////
                        //// PARSE STATE NAME
                        //////////
                        // Identify what parts of the name is a variable and which is an event
                        var nameParts = stateName.split("_");
                        var namePart;

                        switch (nameParts.length) {

                            case 2 :
                                    namePart = nameParts[1];
                                    // Name is potentially cb_event or cb_variableName
                                    event = parseEventName(namePart);
                                    if (!event) {
                                        // It wasn't an event, So it might be a variable
                                        if (parseVariableName(1,1)) {

                                            event = null;
                                            variableDependency = namePart;

                                        } else {

                                            // Not a valid state name, so escape.
                                            return;

                                        }

                                    }
                                break;

                            // Put this one here because it's extremely unlikely
                            case 0:
                            case 1 :
                                    // Stop everything here, this is not a valid state relationship. The name is just 'cb_' or it has no '_' in it at all
                                    cpBuddy.error("Invalid state name '" + stateName + "' on object '" + this.id + "'.");
                                    return;
                                break;

                            // 3 or above
                            default:

                                    namePart = nameParts[1];
                                    event = parseEventName(namePart);
                                    if (!event) {

                                        // This is not the valid event name, so if there is an event, it must be on the index of the array.

                                        namePart = nameParts[nameParts.length - 1];
                                        event = parseEventName(namePart);
                                        if (!event) {

                                            // The last part of the state name is not an event either.
                                            // The only other possibility is that the whole state name (apart from the cb prefix)
                                            // Is a variable dependency
                                            event = "normal";
                                            variableDependency = parseVariableName(1,nameParts.length - 1);
                                            if (!variableDependency) return;

                                        } else {

                                            // The last part of the name IS an event name. So everything between this
                                            // and the prefix must be a variable dependency
                                            variableDependency = parseVariableName(1,nameParts.length - 2);
                                            if (!variableDependency) return;

                                        }

                                    } else {

                                        // event IS the relevant event, and the rest must be the variable dependency
                                        variableDependency = parseVariableName(2,nameParts.length - 1);
                                        if (!variableDependency) return;

                                    }


                                break;
                        }



                        //////////
                        //// CREATE EVENT / VARIABLE RELATIONSHIP
                        //////////
                        if (!variableDependency) variableDependency = "$";

                        // Check for already existing state event relationship
                        if (!stateRelationships[event]) stateRelationships[event] = {};

                        stateRelationships[event][variableDependency] = stateName;

                        // Activate listeners for preset states
                        switch (event) {
                            case "mousedown" :{
                                listenForMouseDownOn(this.currentStateInfo);
                            }
                            case "mouseover":{
                                listenForMouseOverOn(this.currentStateInfo);
                            }
                        }

                        // Check if we need to listen for when the variable changes
                        if (cpBuddy.cpVariables[variableDependency] != undefined && !variableListeners[variableDependency]) {

                            variableListeners[variableDependency] = function () {
                                t.updateState();
                            };
                            cpBuddy.eventDispatcher.addEventListener(cpBuddy.events.VARIABLE_VALUE_CHANGED,variableListeners[variableDependency],variableDependency);
                        }

                    };

                    this.isLinkedState = function(stateName) {

                        // For the sake of preventing bugs, 'Normal' is not considered a linekd state.
                        if (stateName == "Normal") return false;

                        for (var blah in stateRelationships) {

                            for (var variableDependencies in stateRelationships[blah]) {

                                if (stateRelationships[blah][variableDependencies] == stateName) return true;

                            }
                        }
                        return false;
                    };

                    this.updateState = function() {

                        // States have priorities. If you are mouse down, then the mouse is almost certainly over the top
                        // of the object, but the mouse down state is expected to be displayed
                        var event;
                        var relationships;
                        var variableValue;
                        var variableDependency;

                        function evaluateState (doEvaluate, stateName) {

                            if (doEvaluate && stateRelationships[stateName]) {
                                relationships = stateRelationships[stateName];

                                for (variableDependency in relationships) {

                                    variableValue = cpBuddy.cpVariables[variableDependency];

                                    // Just in case they set it to: FALSE
                                    if (typeof variableValue == "string") variableValue = variableValue.toLowerCase();
                                    // If this is not the default state
                                    // If the variable can evaluate to true.
                                    if (variableDependency != "$" && variableValue && variableValue != "false") {

                                        // If that is true, we have found our event
                                        event = relationships[variableDependency];
                                        return true;
                                    }
                                }

                                // If the code gets this far, we have not found a suitable event.
                                // If there is a default event, we'll use that one instead.
                                if (relationships.$) {

                                    event = relationships.$;
                                    return true;

                                }
                            }
                            return false;
                        }

                        if (!evaluateState(down,"mousedown")) {
                            if (!evaluateState(over,"mouseover")) {
                                if (!evaluateState(true,"normal")) {
                                    event = previousNonLinkedState;
                                    // TODO: Set state to whatever was set last before cpBuddy was mucking about.
                                }
                            }
                        }

                        return this.setState(event);
                    };

                    this.setState = function(stateName) {
                        if (stateName != this.currentStateName) {
                            cpBuddy.cp.changeState(this.id,stateName);
                            return true;
                        }
                        return false;
                    };

                    this.handleStateChange = function() {

                        var newState = this.initialStateData.states[this.initialStateData.currentState].stn;
                        if (this.currentStateName != newState) {

                            this.currentStateName = newState;
                            this.currentStateInfo = this.states[newState];

                            // Reposition the new state display objects according to the current possition.
                            this.setLocation(x,y);

                            if (!this.isLinkedState(newState)) {
                                previousNonLinkedState = newState;
                            }


                            // Handle Mouse Listeners
                            if (listeningForMouseDownOn) {
                                listenForMouseDownOn(this.currentStateInfo);
                            }

                            if (listeningForMouseOverOn) {
                                listenForMouseOverOn(this.currentStateInfo);
                            }
                        }
                    };

                    this.handleStateChange();
                }
            },
            /**
             * Div that displays the captivate playbar.
             */
            "playbar":document.getElementById("playbar"),
            /**
             * Div that displays the closed captions.
             */
            "closedCaptions":document.getElementById("cc"),
            "projectContainer":document.getElementById("project_container"),
            "projectWidth":0,
            "projectHeight":0,
            /**
             * HTML Div that displays the current slide
             */
            "slide":document.getElementById("div_Slide"),
            // TODO: Assign this on slide enter
            "contentSlide":null,
            "isResponsiveProject":cp.responsive,
            /**
             * Zero based
             */
            "currentSlideNumber":0,
            /**
             * The character that will be recognized by getSlideObjectByName as a wildcard.
             * The default wildcard character is '@'.
             *
             * For example, if you have an object on slide called: Highlight_Box_1
             * You can access that object by typing: cpBuddy.getSlideObjectByName("Highlight_Box_@")
             * This will return the first object that fits that name, but could have anything in the '@' space.
             *
             * Let's say you had ten highlight boxes on stage, and you wanted to access all of them. They are named:
             * - Highlight_Box_1
             * - Highlight_Box_2
             * - Highlight_Box_3
             * - And so on.
             *
             * You could get an array of all of them by typing: cpBuddy.getSlideObjectsByName("Highlight_Box_@");
             *
             */
            "WILDCARD_CHARACTER":"@",
            "getListOfSlideObjectsMatchingWildcardName":function(name, onlyNames) {

                var index = name.indexOf(cpBuddy.WILDCARD_CHARACTER);

                if (index > -1) { // The name does include the wildcard character

                    // The following comments are written as if the name passed is is: My_@_Box

                    // The part of the name before the wildcard character: My_
                    var start = name.substr(0,index);
                    // The part of the name after the wildcard character: _Box
                    var end = name.substr(index + 1, name.length - 1);

                    var child;
                    var id;
                    var list = [];

                    // TODO: Optimise this with a forEach function
                    for (var i = 0; i < cpBuddy.slide.childNodes.length; i++) {

                        child = cpBuddy.slide.childNodes[i];
                        id = child.id;

                        // Check if this slide objects's name matches the first part of the passed in name.
                        if (id.substr(0,start.length) == start) {

                            // Now check if it matches the last part.
                            if (id.substr(id.length - end.length, id.length - 1) == end) {

                                // The name matches, so we'll add this child to the list of display objects we'll return.
                                if (onlyNames) {

                                    list.push(id);

                                } else {

                                    if (!slideObjectsList[id]) slideObjectsList[id] = new cpBuddy.classes.SlideObjectInterface(child,id);
                                    list.push(slideObjectsList[id]);

                                }

                            }

                        }
                    }

                    return list;

                }

                return null;
            },
            "getSlideObjectsByName": function (name)
            {
                var index = name.indexOf(cpBuddy.WILDCARD_CHARACTER);

                if (index > -1) { // The name does include the wildcard character

                    return cpBuddy.getListOfSlideObjectsMatchingWildcardName(name);

                } else {
                    // If there is no wildcard in the name, we could only possibly get a single result.
                    // Therefore it's simpler to pass this on to the getSlideObjectByName function.
                    return [cpBuddy.getSlideObjectByName(name)];
                }

            },
            /**
             * Retrieves an object from the current slide with the passed in item name
             * @param name Item name of the slide object you wish returned.
             */
            "getSlideObjectByName":function(name) {
                // TODO: Get objects displayed for rest of project.
                if (name.indexOf(cpBuddy.WILDCARD_CHARACTER) > -1) {

                    return cpBuddy.getSlideObjectsByName(name)[0];

                } else {

                    if (!slideObjectsList[name]) {
                        // TODO: Change this method so that it doesn't access the DIV, but rather only the name of a child.
                        var so = cpBuddy.slide.querySelector("#"+name);
                        if (so) {
                            slideObjectsList[name] = new cpBuddy.classes.SlideObjectInterface(so,name);
                        }
                    }

                    // This returns either the slide object proxy, or nothing
                    return slideObjectsList[name];

                }
            },
            "enactMethodOnSlideObjects":function(slideObjects,method){

                if (typeof slideObjects == 'string') {

                    if (slideObjects.indexOf(cpBuddy.WILDCARD_CHARACTER) > -1) {

                        var names = cpBuddy.getListOfSlideObjectsMatchingWildcardName(slideObjects,true);
                        // TODO: Optimise with a for each function
                        for (var i = 0; i < names.length; i++) {

                            method(names[i]);

                        }

                    } else {

                        // Name of singular object
                        method(slideObjects);
                    }

                } else if (slideObjects.tagName === "DIV") { // If the literal slide object was passed in here

                    method(slideObjects.id);

                }

            },
            "hide":function(slideObject) {
                cpBuddy.enactMethodOnSlideObjects(slideObject,cpBuddy.cp.hide);
            },
            "show":function(slideObject) {
                cpBuddy.enactMethodOnSlideObjects(slideObject,cpBuddy.cp.show);
            },
            "enable":function(slideObject) {
                cpBuddy.enactMethodOnSlideObjects(slideObject,cpBuddy.cp.enable);
            },
            "disable":function(slideObject) {
                cpBuddy.enactMethodOnSlideObjects(slideObject,cpBuddy.cp.disable);
            },
            "changeState":function(slideObject,state) {
                cpBuddy.enactMethodOnSlideObjects(slideObject,function(so) {
                    cpBuddy.cp.changeState(so,state);
                });
            },
            "movieControl":{
                "gotoSlide":function(slide){
                    if (!Number(slide)) {
                        slide = cpBuddy.slideLabels.indexOf(slide);
                        if (slide < 0) {
                            return;
                        }
                    }
                    cpBuddy.cpInterface.gotoSlide(slide);
                },
                "jumpToFrame":function(frameNumber) {
                    cpBuddy.cp.movie.jumpToFrame(frameNumber);
                }
            },
            "executeActionOn":function(interactiveObject,condition) {

                var data = cpBuddy.getDataForSlideObject(interactiveObject);

                if (data) {

                    if (!condition) condition = "success";
                    else condition = condition.toLowerCase();

                    var action;

                    switch (condition) {
                        case "success" :
                            action = data.oca;
                            break;

                        case "failure" :
                            action = data.ofa;
                            break;

                        case "focuslost":
                        case "onfocuslost":
                            action = data.ofla;
                            break;
                    }

                    if (action) {

                        eval(action);

                    } else {

                        cpBuddy.error("Could not find a '" + condition + "' action for " + interactiveObject);

                    }
                }

            },
            "getDataForSlideObject":function(slideObject) {
                if (slideObject.tagName === "DIV") {
                    slideObject = interactiveObject.id;
                }

                return cpBuddy.projectData.data[slideObject];
            }
        };

        ///////////////////////////////////////////////
        /////////////// API PRIVATE VARIABLES
        ///////////////////////////////////////////////

        // List of already created slide objects.
        var slideObjectsList = {};

        // Object to handle adding special features to Captivate Variables with specific prefixes.
        var variableManager = {
            "init":function() {
                var captivateVariables = cpBuddy.cp.variablesManager.varInfos;
                var variableBreakdown;
                var hasStorageVariables = false;

                captivateVariables.forEach(function(variable){
                    if (!variable.systemDefined) {

                        this.userVariables.push(variable.name);
                        variableBreakdown = variable.name.split("_");


                        switch (variableBreakdown[0]) {

                            // Local storage variable
                            case "ss":
                            case "ls":

                                    this.storageVariables[variable.name] = {"type":variableBreakdown,"linkedTextBoxes":[]};
                                    hasStorageVariables = true;

                                break;


                            // Cp Buddy variable
                            case "cb":
                                // TODO: Add the following variables
                                    // tb_closedCaptionsText - Holds the current closed caption text. Writing to it changes the closed captioning text
                                    // tb_isConnectedToInternet - Boolean, indicates whether or not the browser is working offline.
                                    // tb_stageWidth
                                    // tb_stageHeight

                                    if (cpBuddy.projectData.data[variableBreakdown[1]]) {
                                        // If we are here we have found a variable that links to a slide object
                                        // TODO: Implement
                                    }

                                break;

                            // Slide object information
                                // so_MyHighlightBox_x
                            case "so" :

                                break;
                        }
                    }
                },this);


                ///////////////////////////////////////////////
                ///////////////// Set Up Command Variables
                ///////////////////////////////////////////////
                var add = function (name,parameterHandleMethod,method) {

                    if (cpBuddy.cpVariables[name] != undefined) {

                        cpBuddy.eventDispatcher.addEventListener(cpBuddy.events.VARIABLE_VALUE_CHANGED,function (e){

                            if (e.cpData.newVal != null) {
                                parameterHandleMethod(e.cpData.newVal,method);
                                cpBuddy.cpVariables[name] = null;
                            }
                        },name);

                    }
                };
                var callMethodForEachParameter = function(v,method){
                    // TODO: Remove Spaces
                    v.split(",").forEach(function(parameter){
                        method(parameter);
                    });
                };
                var formatParametersForMethod = function(v,method){

                    // TODO: Implement
                    // TODO: Remove Spaces
                    method(v.split(","));
                };
                add("cbCmndHide",callMethodForEachParameter,cpBuddy.hide);
                add("cbCmndShow",callMethodForEachParameter,cpBuddy.show);
                add("cbCmndEnable",callMethodForEachParameter,cpBuddy.enable);
                add("cbCmndDisable",callMethodForEachParameter,cpBuddy.disable);
                add("cbCmndChangeState",formatParametersForMethod,function(parameters){

                    if (parameters.length == 2) {

                        cpBuddy.changeState(parameters[0],parameters[1]);

                    } else {

                        cpBuddy.error("Assigning '" + String(parameters) + "' to cbCmndChangeState failed. This command takes two parameters. No more, no less.")

                    }

                });
                add("cbCmndExecuteActionOn",formatParametersForMethod,function(parameters){

                    switch (parameters.length) {

                        // CURRENTLY THIS SINGLE PARAMETER COMMAND DOESN'T WORK DUE TO A CAPTIVATE BUG
                        case 1:
                            cpBuddy.executeActionOn(parameters[0]);
                            break;

                        case 2:
                            cpBuddy.executeActionOn(parameters[0],parameters[1]);
                            break;
                    }

                });



                ///////////////////////////////////////////////
                ///////////////// Set Up Storage Variables
                ///////////////////////////////////////////////
                if (hasStorageVariables) {

                    // Local Storage Variables will only be written into cache when the window is closed down. So
                    // we'll listen for that.

                    window.addEventListener("unload", function(){


                        variableManager.saveLocalStorageVariables.call(variableManager);

                    });



                    // The following block of code goes through the project data, finds any text entry boxes linked
                    // to this variable, and then adds it to the textBoxData array.
                    var slideObject;
                    var storageVariableInfo;

                    for (var slideObjectName in cpBuddy.projectData.data) {

                        slideObject = cpBuddy.projectData.data[slideObjectName];

                        if (slideObject.type && slideObject.type === cpBuddy.slideObjectTypeIDs.TEXT_ENTRY_BOX) {

                            // Check to see if the variable attached to this text entry box (slideObject.vn) is
                            // one of our storage variables.
                            storageVariableInfo = this.storageVariables[slideObject.vn];
                            if (storageVariableInfo !== undefined) {

                                // If there is a link, then we will put this text entry box on the watch list.
                                storageVariableInfo.linkedTextBoxes.push(cpBuddy.projectData.data[slideObjectName + "c"]);

                            }
                        }
                    }


                    // Now that this.storageVariables contains a full list of local storage variables
                    // and their associated TextEntryBoxes, we will now add listeners to the variables, hear when they change
                    // and then modify the default text of the text entry boxes.
                    var value;
                    var listenerFunction = function() {

                        this.textBoxData.forEach(function(textBoxData){

                            switch (typeof textBoxData.txt) {

                                case "string":
                                    textBoxData.txt = cpBuddy.cpVariables[this.variableName];
                                    break;

                                case "object":
                                    for (var setting in textBoxData.txt) {
                                        textBoxData.txt[setting] = cpBuddy.cpVariables[this.variableName];
                                    }
                                    break;

                            }
                        },this);
                    };


                    for (var storageVariableName in this.storageVariables) {
                        storageVariableInfo = this.storageVariables[storageVariableName];

                        if (storageVariableInfo.linkedTextBoxes.length > 0) {

                            this.addVariableListener({
                                "variableName":storageVariableName,
                                "textBoxData":storageVariableInfo.linkedTextBoxes,
                                "listener":listenerFunction

                            });
                        }

                        switch (storageVariableInfo.type) {
                            case "ls" :
                                // Retrieve this variable value from local storage
                                value = window.localStorage.getItem(storageVariableName);
                                break;

                            case "ss" :
                                // Retreive this variable value from session storage
                                value = window.sessionStorage.getItem(storageVariableName);
                                break;
                        }

                        if (value) {

                            if (!isNaN(value)) {
                                // This should really be typed as a number
                                value = parseFloat(value);
                            }
                            // TODO: If the VARIABLE_CHANGED event is only dispatched when using the cpInterface.setVariable function, then use that instead.
                            cpBuddy.cpInterface.setVariableValue(storageVariableName,value);

                        }

                    }
                }

            },



            "saveLocalStorageVariables":function() {

                // Loop through the storage variables to save the variables!
                for (var variableName in this.storageVariables) {

                    switch (this.storageVariables[variableName].type) {
                        case "ls" :
                           // Recording in local storage
                           window.localStorage.setItem(variableName, cpBuddy.cpVariables[variableName]);
                           break;

                       case "ss" :
                           // Record in session storage
                           window.sessionStorage.setItem(variableName, cpBuddy.cpVariables[variableName]);
                           break;
                    }

                }

            },

            "addVariableListener":function(data) {
                cpBuddy.eventDispatcher.addEventListener(cpBuddy.events.VARIABLE_VALUE_CHANGED,
                        function (e) {
                            data.listener.call(data,e);
                        },
                        data.variableName);
            },

            "userVariables":[],
            "storageVariables":{}
        };

        /////////////////////////////////
        ////////// Set Up Complex Objects
        /////////////////////////////////
        var slides = cpBuddy.projectData.data.project_main.slides.split(",");
        var data;
        slides.forEach(function(slideID) {
            data = cpBuddy.projectData.data[slideID];
            cpBuddy.slideData.push(data);
            cpBuddy.slideLabels.push(data.lb);
        });

        // Now that cpBuddy has been initialized, we can start seeing if the user has set up any special variables
        // that we should add information to
        variableManager.init();




        /////////////////////////////////
        ////////// Cp Overrides
        /////////////////////////////////
        var rawCPChangeState = cpBuddy.cp.changeState;

        cpBuddy.cp.changeState = function(a,b,c,d) {
            rawCPChangeState(a,b,c,d);

            if (slideObjectsList[a]) {
                slideObjectsList[a].handleStateChange();
            }
        };







        /////////////////////////////////
        ////////// Slide Set Up
        /////////////////////////////////
        /*cpBuddy.eventDispatcher.addEventListener(cpBuddy.events.SLIDE_EXIT, function() {

                console.log("Last Frame: " + cpBuddy.stage.lastFrame);
            if (cpBuddy.currentSlideData.sxa) {
            }

        });*/


        var resizeHandler = function(){

            /// PROJECT WIDTH
            if (cpBuddy.isResponsiveProject) {

                if (cpBuddy.projectContainer.style.width == "100%") {

                    cpBuddy.projectWidth = window.innerWidth;

                } else {

                    cpBuddy.projectWidth = parseInt(cpBuddy.projectContainer.style.width);

                }

            } else {

                cpBuddy.projectWidth = cpBuddy.projectContainer.style.width;

            }

            /// PROJECT HEIGHT
            cpBuddy.projectHeight = Math.min(parseInt(document.getElementById("project").style.height), window.innerHeight);

            // There is a cpBuddy info variable called: cbInfo_ProjectWidth. This is the appropriate time to set the project width information.
            if (cpBuddy.cpVariables.cbInfo_ProjectWidth != undefined) cpBuddy.cpInterface.setVariableValue("cbInfo_ProjectWidth", String(cpBuddy.projectWidth));
            if (cpBuddy.cpVariables.cbInfo_ProjectHeight != undefined) cpBuddy.cpInterface.setVariableValue("cbInfo_ProjectHeight", cpBuddy.projectHeight);

        };
        window.addEventListener("resize",resizeHandler);
        // Init the projectWidth and projectHeight variables.
        resizeHandler();

        cpBuddy.eventDispatcher.addEventListener(cpBuddy.events.SLIDE_ENTER,function(){


            // Having moved to a new slide, the previous slide objects have all been deleted.
            // Therefore, unload the slide object proxies and delete them.
            for (var slideObjectName in slideObjectsList) {
                slideObjectsList[slideObjectName].unload();
            }
            slideObjectsList = {};


            var sn  = cpBuddy.cpVariables.cpInfoCurrentSlide - 1;
            var data  = cpBuddy.slideData[sn];
            cpBuddy.currentSlideNumber = sn;
            cpBuddy.currentSlideData = data;

            // Proceed to examine the objects on this slide
            // TODO: See if Local Storage Variables and Text Entry Boxes issue can be sorted out here instead.

            var states;
            var stateName;
            var a;
            var slideObject;
            var inspectStateMethod = function (state){

                stateName = state.stn;
                a = stateName.substr(0,3);

                if (a == "cb_") {
                    // We have a interactive state!
                    if (!slideObject) slideObject = cpBuddy.getSlideObjectByName(slideObjectName);
                    slideObject.createStateEventRelationship(stateName);

                }

            };

            // Loop through all the slide objects appearing on this slide.
            data.si.forEach(function (slideObjectData) {

                // The slide object data provided in the slideData array is extremely limited.
                // Instead, we'll grab the name of the object, and inspect its details in the project data section.
                slideObjectName = slideObjectData.n;
                slideObjectData = cpBuddy.projectData.data[slideObjectName];

                // Grab the state information
                states = slideObjectData.stl;

                // If this object has states, then we will continue.
                if (states) {

                    states.forEach(inspectStateMethod,this);

                    if (slideObject) {
                        // A state must have been set up for this slide object if this variable is populated
                        slideObject.updateState();
                        slideObject = null;

                    }

                }
            },this);








            ////////////////////////////////////
            //////////// TESTING CODE
            ////////////////////////////////////
            // Should be removed on release



        });

    }






}());