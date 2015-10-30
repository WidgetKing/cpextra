/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 26/10/15
 * Time: 3:56 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("SlideObjectStateManager", function () {

    "use strict";

    function SlideObjectStateManager (slideObject, data) {


        var that = this,
            isMouseOver = false,
            isMouseDown = false,
            previousNormalState = slideObject.state;

        this.slideObject = slideObject;
        this.data = data;






        ///////////////////////////////////////////////////////////////////////
        /////////////// Util Methods
        ///////////////////////////////////////////////////////////////////////
        function isManagedState(stateName) {

            var mouseEventDetails,
                managedStateName;

            for (var mouseEvent in data) {
                if (data.hasOwnProperty(mouseEvent)) {

                    mouseEventDetails = data[mouseEvent];
                    for (managedStateName in mouseEventDetails) {
                        if (mouseEventDetails.hasOwnProperty(managedStateName) &&
                            managedStateName === stateName) {

                            return true;

                        }
                    }

                }
            }

            return false;
        }

        function doVariableValueComparison(variableValue, intendedValue) {
            if (typeof variableValue !== "boolean" && !isNaN(variableValue)) {
                variableValue = parseFloat(variableValue);
            } else if (variableValue === "false") {
                variableValue = false;
            }
            // I know here I use '!=' instead of '!==' but that is intentional as I want false == 0
            return variableValue == intendedValue;
        }


        ///////////////////////////////////////////////////////////////////////
        /////////////// State Inspection
        ///////////////////////////////////////////////////////////////////////
        function findStateWithValidVariables(shouldEvaluate, stateData) {

            // This shouldEvaluate calculation is done here instead of the proceeding function because it reduces
            // repetition.
            if (shouldEvaluate) {

                var variableData,
                    variableName,
                    isStateValid;

                // Loop through { r: { x_rollover... } }
                for (var stateName in stateData) {
                    if (stateData.hasOwnProperty(stateName)) {

                        variableData = stateData[stateName];
                        // We assume the state to be valid until we find proof that it's not.
                        // We need many variables to be true to work, and only one to be false to break it.
                        isStateValid = true;

                        // Loop through { r: { x_rollover: { variableName ... } }
                        for (variableName in variableData) {
                            if (variableData.hasOwnProperty(variableName)) {

                                if (!doVariableValueComparison(_extra.variableManager.getVariableValue(variableName),
                                                               variableData[variableName])) {

                                    isStateValid = false;
                                    break;

                                }

                            }
                        }

                        // If we have checked all the variables in this state as a NO.
                        if (isStateValid) {

                            slideObject.changeState(stateName);
                            return true;

                        }

                    }
                }

            }

            return false;
        }

        function evaluateState() {

            // Mouse down states take priority, even if there are valid rollover or normal states.
            if (!findStateWithValidVariables(isMouseDown, data.d)) {
                // Rollover states take priority over normal states.
                if (!findStateWithValidVariables(isMouseOver, data.r)) {

                    // Normal states have the lowest priority.
                    if (!findStateWithValidVariables(true, data.n)) {

                        slideObject.changeState(previousNormalState);

                    }

                }
            }

        }




        ///////////////////////////////////////////////////////////////////////
        /////////////// Event Listeners
        ///////////////////////////////////////////////////////////////////////
        ////////////////////////////////
        ////////// Mouse Over
        this.onRollover = function () {
            // Remove Listener
            slideObject.removeEventListener("mouseover", that.onRollover);
            // Update Information
            isMouseOver = true;
            // Change State
            evaluateState();
            // Listen for new mouse event
            slideObject.addEventListener("mouseout", that.onRollout);
        };

        this.onRollout = function () {

            slideObject.removeEventListener("mouseout", that.onRollout);
            isMouseOver = false;
            evaluateState();
            slideObject.addEventListener("mouseover", that.onRollover);

        };

        ////////////////////////////////
        ////////// Mouse Down
        this.onMouseDown = function () {

            slideObject.removeEventListener("mousedown", that.onMouseDown);
            isMouseDown = true;
            evaluateState();
            _extra.w.document.addEventListener("mouseup", that.onMouseUp);

        };

        this.onMouseUp = function () {

            _extra.w.document.removeEventListener("mouseup", that.onMouseUp);
            isMouseDown = false;
            evaluateState();
            slideObject.addEventListener("mousedown", that.onMouseDown);

        };

        ////////////////////////////////
        ////////// Start Listening
        if (data.r) {
            slideObject.addEventListener("mouseover", this.onRollover);
        }

        if (data.d) {
            slideObject.addEventListener("mousedown", this.onMouseDown);
        }






        ///////////////////////////////////////////////////////////////////////
        /////////////// Manage finding the 'normal' state
        ///////////////////////////////////////////////////////////////////////
        this.onStateChangeCallback =  function (details) {
            // If this is not a state that we are automatically switching to...
            if (!isManagedState(details.stateName)) {
                // Then we should switch back to this state as the 'normal' state.
                previousNormalState = details.stateName;
            }
        };

        _extra.slideObjects.states.changeCallback.addCallback(slideObject.name, this.onStateChangeCallback);






        ///////////////////////////////////////////////////////////////////////
        /////////////// Manage listening for Variables changing
        ///////////////////////////////////////////////////////////////////////
        var eventName,
            eventData,
            stateName,
            variableData,
            variableName,
            variableListeners = {};

        // Looping through { r... d... n...}
        for (eventName in data) {
            if (data.hasOwnProperty(eventName)) {

                eventData = data[eventName];

                // Looping through { r: { x_over ... } }
                for (stateName in eventData) {
                    if (eventData.hasOwnProperty(stateName)) {

                        variableData = eventData[stateName];

                        // Looping through { r: { x_over : { variableName ... } } }
                        for (variableName in variableData) {
                            if (variableData.hasOwnProperty(variableName)) {

                                // If we're not already listening for this variable.
                                if (!variableListeners[variableName]) {

                                    _extra.variableManager.listenForVariableChange(variableName, evaluateState);
                                    // Mark this as true to avoid listening to this variable more than once.
                                    variableListeners[variableName] = true;

                                }

                            }
                        }

                    }
                }

            }
        }


        ////////////////////////////////
        ////////// KICK OFF!
        ///// Check to see if there are any states that are valid now.
        evaluateState();
        
    }

    SlideObjectStateManager.prototype.unload = function () {
        this.slideObject.removeEventListener("mouseover", this.onRollover);
        this.slideObject.removeEventListener("mouseout", this.onRollout);
        this.slideObject.removeEventListener("mousedown", this.onMouseDown);
        _extra.w.document.removeEventListener("mouseup", this.onMouseUp);

        _extra.slideObjects.states.changeCallback.removeCallback(this.slideObject.name, this.onStateChangeCallback);

        this.slideObject = null;
        this.data = null;
    };

    _extra.registerClass("SlideObjectStateManager", SlideObjectStateManager);
});