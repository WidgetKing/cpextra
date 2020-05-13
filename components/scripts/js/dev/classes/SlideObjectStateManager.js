/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 26/10/15
 * Time: 3:56 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("SlideObjectStateManager", function() {
  "use strict";

  function SlideObjectStateManager(slideObject, data) {
    this.data = data;
    this.slideObject = slideObject;
    this.mainDIV = _extra.captivate.projectContainer;

    var that = this,
      isMouseOver = false,
      isMouseDown = false,
      previousNormalState = getNormalState(slideObject.state, this.data);

    ///////////////////////////////////////////////////////////////////////
    /////////////// Util Methods
    ///////////////////////////////////////////////////////////////////////

    /**
     * Returns the correct previousNormalState.
     * It will either be the suggestedState passed in, or will be the 'Normal' state.
     *
     * @pure
     * @param suggestedState The state that could possibly be the new 'normal
     * @param cpExtraStatesList The list of states that CpExtra is controlling.
     */
    function getNormalState(suggestedState, stateData) {
      if (isCpExtraState(suggestedState, stateData)) {
        // The suggested state is managed by CpExtra.
        // So we'll say the normal state is the state named 'Normal'
        // which every slide object has.
        return "Normal";
      } else {
        return suggestedState;
      }
    }

	  /**
	   * Determines whether a state name exists in any of our
	   * state data
	   * @pure
	   */
    function isCpExtraState(name, data) {
      if (data) {
        if (
          (data.n && data.n.hasOwnProperty(name)) ||
          (data.r && data.r.hasOwnProperty(name)) ||
          (data.d && data.d.hasOwnProperty(name))
        ) {
          return true;
        }
      }

      return false;
    }

    /**
     * Currently there are two ways a state could be a mouse event state.
     * 1: This state is using CpExtra to display on mouseover or rollover.
     * 2: This is a Captivate Button which has a RollOver or Down state.
     * @param stateName
     * @returns {boolean}
     */
    function isMouseEventState(stateName) {
      var mouseEventDetails, managedStateName;

      // Captivate's native button 'RollOver' and 'Down' would count as 'managed states'
      // This allows us to have a variable state along with the native rollover and down states
      if (stateName === "RollOver" || stateName === "Down") {
        return true;
      }

      for (var mouseEvent in data) {
        if (data.hasOwnProperty(mouseEvent)) {
          mouseEventDetails = data[mouseEvent];
          for (managedStateName in mouseEventDetails) {
            if (
              mouseEventDetails.hasOwnProperty(managedStateName) &&
              managedStateName === stateName
            ) {
              return true;
            }
          }
        }
      }

      return false;
    }

    function validateVariableValue(variableValue) {
      if (
        typeof variableValue !== "boolean" &&
        !_extra.w.isNaN(variableValue)
      ) {
        if (variableValue === "") {
          variableValue = false;
        } else {
          variableValue = _extra.w.parseFloat(variableValue);
        }
      } else if (typeof variableValue === "string") {
        // We want TRUE to still be a valid boolean.
        var lowerCaseVariableValue = variableValue.toLowerCase();

        if (lowerCaseVariableValue === "true") {
          variableValue = true;
        } else if (lowerCaseVariableValue === "false") {
          variableValue = false;
        }
      }

      return variableValue;
    }

    function doVariableValueComparison(variableValue, intendedValue) {
      // This means no destination value was given to the state. The state name would look something like: x_MyVar
      // In this case we'll assume this should be true.
      // We don't correct this further up, because it may yet be useful to know if the user did or didn't
      // specify a value.
      if (intendedValue === null) {
        intendedValue = true;
      }

      // First, make sure the variable value comes back as true number and boolean objects
      variableValue = validateVariableValue(variableValue);

      // If intendedValue is an object, then the
      if (typeof intendedValue === "object") {
        var intendedValueData = intendedValue;
        intendedValue = intendedValueData.value;

        switch (intendedValueData.modifier) {
          case "!":
            return variableValue != intendedValue;

          case ">":
            return variableValue > intendedValue;

          case "<":
            return variableValue < intendedValue;

          case ">=":
            return variableValue >= intendedValue;

          case "<=":
            return variableValue <= intendedValue;
        }
      } else {
        // A normal comparison

        // I know here I use '!=' instead of '!==' but that is intentional as I want false == 0
        return variableValue == intendedValue;
      }
    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// State Inspection
    ///////////////////////////////////////////////////////////////////////
    function findStateWithValidVariables(shouldEvaluate, stateData) {
      // This shouldEvaluate calculation is done here instead of the proceeding function because it reduces
      // repetition.
      if (shouldEvaluate) {
        var variableData, variableName, isStateValid;

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
                if (
                  !doVariableValueComparison(
                    _extra.variableManager.getVariableValue(variableName),
                    variableData[variableName]
                  )
                ) {
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
    this.onRollover = function() {
      // Remove Listener
      slideObject.removeEventListener(
        _extra.eventManager.events.MOUSE_OVER,
        that.onRollover
      );
      // Update Information
      isMouseOver = true;
      // Change State
      evaluateState();
      // Listen for new mouse event
      slideObject.addEventListener(
        _extra.eventManager.events.MOUSE_OUT,
        that.onRollout
      );
      // Added this because sometimes when the mouse is moving very fast, the above event listener doesn't trigger.
      that.mainDIV.addEventListener(
        _extra.eventManager.events.MOUSE_OUT,
        that.onRollout
      );
    };

    this.onRollout = function() {
      that.mainDIV.removeEventListener(
        _extra.eventManager.events.MOUSE_OUT,
        that.onRollout
      );
      slideObject.removeEventListener(
        _extra.eventManager.events.MOUSE_OUT,
        that.onRollout
      );
      isMouseOver = false;
      evaluateState();
      slideObject.addEventListener(
        _extra.eventManager.events.MOUSE_OVER,
        that.onRollover
      );
    };

    ////////////////////////////////
    ////////// Mouse Down
    this.onMouseDown = function() {
      slideObject.removeEventListener(
        _extra.eventManager.events.MOUSE_DOWN,
        that.onMouseDown
      );
      isMouseDown = true;
      evaluateState();
      _extra.w.document.addEventListener(
        _extra.eventManager.events.MOUSE_UP,
        that.onMouseUp
      );
    };

    this.onMouseUp = function() {
      _extra.w.document.removeEventListener(
        _extra.eventManager.events.MOUSE_UP,
        that.onMouseUp
      );
      isMouseDown = false;
      evaluateState();
      slideObject.addEventListener(
        _extra.eventManager.events.MOUSE_DOWN,
        that.onMouseDown
      );
    };

    ////////////////////////////////
    ////////// Start Listening
    if (data.r) {
      slideObject.addEventListener(
        _extra.eventManager.events.MOUSE_OVER,
        this.onRollover
      );
    }

    if (data.d) {
      slideObject.addEventListener(
        _extra.eventManager.events.MOUSE_DOWN,
        this.onMouseDown
      );
    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// Manage finding the 'normal' state
    ///////////////////////////////////////////////////////////////////////
    this.onStateChangeCallback = function(details) {
      // If this is not a state that we are automatically switching to...
      if (!isMouseEventState(details.stateName)) {
        // Then we should switch back to this state as the 'normal' state.
        previousNormalState = details.stateName;
      }
    };

    _extra.slideObjects.states.changeCallback.addCallback(
      slideObject.name,
      this.onStateChangeCallback
    );

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
                  _extra.variableManager.listenForVariableChange(
                    variableName,
                    evaluateState
                  );
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

  SlideObjectStateManager.prototype.unload = function() {
    this.slideObject.removeEventListener(
      _extra.eventManager.events.MOUSE_OVER,
      this.onRollover
    );
    this.slideObject.removeEventListener(
      _extra.eventManager.events.MOUSE_OUT,
      this.onRollout
    );
    this.slideObject.removeEventListener(
      _extra.eventManager.events.MOUSE_DOWN,
      this.onMouseDown
    );
    _extra.w.document.removeEventListener(
      _extra.eventManager.events.MOUSE_UP,
      this.onMouseUp
    );
    this.mainDIV.removeEventListener(
      _extra.eventManager.events.MOUSE_OUT,
      this.onRollout
    );

    _extra.slideObjects.states.changeCallback.removeCallback(
      this.slideObject.name,
      this.onStateChangeCallback
    );

    this.slideObject = null;
    this.data = null;
    this.mainDIV = null;
  };

  _extra.registerClass("SlideObjectStateManager", SlideObjectStateManager);
});
