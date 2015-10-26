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
            previousNormalState = "Normal";

        this.slideObject = slideObject;
        this.data = data;



        ///////////////////////////////////////////////////////////////////////
        /////////////// Variable Validity
        ///////////////////////////////////////////////////////////////////////
        function findStateWithValidVariables(shouldEvaluate, stateData) {
            if (shouldEvaluate) {

                //var stateCondition;

                for (var stateName in stateData) {
                    if (stateData.hasOwnProperty(stateName)) {

                        slideObject.changeState(stateName);
                        return true;

                    }
                }

            }

            return false;
        }

        function evaluateState() {

            if (!findStateWithValidVariables(isMouseDown, data.d)) {
                if (!findStateWithValidVariables(isMouseOver, data.r)) {

                    if (!findStateWithValidVariables(true, data.n)) {

                        slideObject.changeState(previousNormalState);
                        // TODO: Switch to the last normal state
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





        ///////////////////////////////////////////////////////////////////////
        /////////////// Kick off
        ///////////////////////////////////////////////////////////////////////
        if (data.r) {
            slideObject.addEventListener("mouseover", this.onRollover);
        }

        if (data.d) {
            slideObject.addEventListener("mousedown", this.onMouseDown);
        }

        // TODO: evaluateState here in order to check variables that have already been set.
    }

    SlideObjectStateManager.prototype.unload = function () {
        this.slideObject.removeEventListener("mouseover", this.onRollover);
        this.slideObject.removeEventListener("mouseout", this.onRollout);
        this.slideObject.removeEventListener("mousedown", this.onMouseDown);
        _extra.w.document.removeEventListener("mouseup", this.onMouseUp);

        this.slideObject = null;
        this.data = null;
    };

    _extra.registerClass("SlideObjectStateManager", SlideObjectStateManager);
});