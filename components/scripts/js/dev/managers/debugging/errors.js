/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 19/11/15
 * Time: 11:37 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("errors", ["debuggingManager"], function () {

    "use strict";

    _extra.debugging.errors = {

        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        //////////////////// AUTO STATE ERRORS
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        "AS001": function (slideObject, state, variable) {
            return "<b>" + slideObject + "</b> has a state named <b>" + state + "</b>. " +
                   "<br/>However, there appears to be no matching variable named <b>" + variable + "</b>. " +
                   "<br/>To correct this issue ensure variable and state names match.";
        },

        "AS002": function (slideObject, state, variable) {
            return "<b>" + slideObject + "</b> has a state named <b>" + state + "</b>. " +
                   "<br/>However, a state name cannot use a variable name (e.g. <b>" + variable + "</b>) more than once. " +
                   "<br/>To fix this error, ensure there is only once reference to <b>" + variable + "</b> in the state name.";
        },

        "AS003": function (slideObject) {
            return "At _extra.slideObjects.states.registerStateMetaData, tried to register data for <b>" + slideObject +
                    "</b> twice. Has unloading of this data from a previous slide been unsuccessful?";
        },

        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        //////////////////// COMMAND VARIABLE ERRORS
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        /////////////// General errors for command variables
        ///////////////////////////////////////////////////////////////////////
        "CV001": function (slideObject) {
            return "Could not find a slide object in the movie by the name of <b>" + slideObject + "</b>." +
                   "<br/>To resolve this issue, please find the xcmnd variable that is attempting to reference " +
                   "this object and check you have spelled the object's name correctly.";
        },

        ///////////////////////////////////////////////////////////////////////
        /////////////// xcmndCallActionOn
        ///////////////////////////////////////////////////////////////////////
        "CV010": function (slideObject, criteria) {
            return "Unable to call a <b>" + criteria + "</b> action on <b>" + slideObject +"</b> because <b>" +
                    criteria + "</b> is not listed as a valid action. " + "<br/>Please check the spelling of <b>" +
                    criteria + "</b>.";
        },
        "CV011": function (slideObject) {
            return "Tried to call a <b>focus lost</b> action on <b>" + slideObject +
                   "</b>. However this interactive object has no <b>focus lost</b> action." +
                   "<br/>Please ensure <b>" + slideObject + "</b> is a Text Entry Box.";
        },
        "CV012": function (slideObject) {
            return "Could not call action on <b>" + slideObject + "</b> as it is not an interactive object. " +
                   "<br/>To resolve this issue, change <b>" + slideObject + "</b> to be an interactive object " +
                   "(i.e. an object with success / failure criteria).";
        },
        "CV013": function (slideObject) {
            return "Tried to call an action on <b>" + slideObject + "</b> but could not find any slide objects with that name. " +
                   "<br/>Please ensure there is an interactive object with the name <b>" + slideObject + "</b>.";
        },

        ///////////////////////////////////////////////////////////////////////
        /////////////// xcmndSetCursor
        ///////////////////////////////////////////////////////////////////////
        "CV020": function (query, cursorName) {
            return "Tried to use xcmndSetCursor to apply cursor named <b>" + cursorName + "</b> to <b>" + query + "</b>. " +
                   "<b>" + cursorName + "</b> is not a valid cursor name. " +
                    "<br/>Please check if you have misspelt the cursor name.";
        }

    };

});