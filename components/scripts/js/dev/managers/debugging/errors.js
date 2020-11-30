/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 19/11/15
 * Time: 11:37 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("errors", ["debuggingManager"], function() {
  "use strict";

  _extra.debugging.errors = {
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// LOCAL STORAGE ERRORS
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    PV001: function(storageType) {
      return (
        "This browser does not support <b>" +
        storageType +
        " storage variables.</b> " +
        "Please upgrade to the latest version of the browser." +
        "<br/>If this is not possible, either remove storage variables from this project <b>OR</b> set " +
        "the <b>xprefDebugMode</b> variable to <b>false</b> to stop this message appearing."
      );
    },

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// AUTO STATE ERRORS
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    AS001: function(slideObject, state, variable) {
      return (
        "<b>" +
        slideObject +
        "</b> has a state named <b>" +
        state +
        "</b>. " +
        "<br/>However, there appears to be no matching variable named <b>" +
        variable +
        "</b>. " +
        "<br/>To correct this issue ensure variable and state names match."
      );
    },

    AS002: function(slideObject, state, variable) {
      return (
        "<b>" +
        slideObject +
        "</b> has a state named <b>" +
        state +
        "</b>. " +
        "<br/>However, a state name cannot use a variable name (e.g. <b>" +
        variable +
        "</b>) more than once. " +
        "<br/>To fix this error, ensure there is only once reference to <b>" +
        variable +
        "</b> in the state name."
      );
    },

    AS003: function(slideObject) {
      return (
        "At _extra.slideObjects.states.registerStateMetaData, tried to register data for <b>" +
        slideObject +
        "</b> twice. Has unloading of this data from a previous slide been unsuccessful?"
      );
    },

    AS004: function(slideObject, state, keyword) {
      return (
        "<b>" +
        slideObject +
        "</b> has a state named <b>" +
        state +
        "</b>. " +
        "<br/>However, there is no value written after the keyword <b>" +
        keyword +
        "</b>. " +
        "Therefore CpExtra does not know how to evaluate the <b>" +
        state +
        "</b> state. " +
        "<br/>To correct this issue write a value after the <b>" +
        keyword +
        "</b> keyword."
      );
    },

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// EFFECT ERRORS
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    EE001: function() {
      return (
        "The end of a CpMate effect was not detected where it was expected. This " +
        "can be caused by having one CpMate effect overlap with another CpMate effect " +
        "or an effect that alters transparency (alpha). <br/>Please check your project."
      );
    },

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// PARSING ERRORS
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    PE001: function(variableName) {
      return (
        "Tried to access explicitly defined variable <b>$$" +
        variableName +
        "$$</b>." +
        "<br/>However, there is no variable of the name <b>" +
        variableName +
        "</b>." +
        "<br/>To correct this issue please check that you have spelled the variable's name correctly."
      );
    },

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// COMMAND VARIABLE ERRORS
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    /////////////// General errors for command variables
    ///////////////////////////////////////////////////////////////////////
    CV001: function(slideObject) {
      return (
        "Could not find a slide object in the movie by the name of <b>" +
        slideObject +
        "</b>." +
        "<br/>To resolve this issue, please find the xcmnd variable that is attempting to reference " +
        "this object and check you have spelt the object's name correctly."
      );
    },

    CV002: function(variableName) {
      return (
        "Could not find a variable in the movie by the name of <b>" +
        variableName +
        "</b>." +
        "<br/>To resolve this issue, please find the xcmnd variable that is attempting to " +
        "reference this variable and check you have spelt the variable's name correctly."
      );
    },

    CV003: function(invalidString) {
      return (
        "The string <b>" +
        invalidString +
        "</b> does not match an expected keyword " +
        "for the command variable it was assigned to." +
        "<br/>Please check the spelling of <b>" +
        invalidString +
        "</b> and that you are assigning " +
        "to the correct command variable"
      );
    },

    CV004: function(query) {
      return (
        "Tried to use the @syntax query <b>" +
        query +
        "</b> on a parameter that doesn't allow " +
        "@syntax queries.<br/>Please remove the @syntax query and replace it with a singular property."
      );
    },

    CV005: function(number) {
      return (
        "Tried to pass use the value <b>" +
        number +
        "</b> for a property that requires a number." +
        "<br/>Please check the spelling of <b>" +
        number +
        "</b>"
      );
    },

    CV006: function(slideObject, property) {
      return (
        "Tried to write to slide object <b>" +
        slideObject +
        "</b>'s <b>" +
        property +
        "</b> property." +
        "<br/>However, this is not a property that CpExtra allows you to set. " +
        "<br/>Do not attempt to write to the <b>" +
        property +
        "</b> property"
      );
    },

    CV007: function(slideObject) {
      return (
        "Tried to interact with slide object <b>" +
        slideObject +
        "</b>. " +
        "However, this action requires an interactive object, and <b>" +
        slideObject +
        "</b> " +
        "is not an interactive object." +
        "<br/>Please check the spelling of <b>" +
        slideObject +
        "</b>. "
      );
    },

    CV008: function(number) {
      return (
        "Received number <b>" +
        number +
        "</b> where a variable name was expected. " +
        "If you assign a variable name to another variable, Captivate automatically " +
        "swaps out that string with the variable's value. <br/>To fix this issue, surround " +
        "the variable name in square braces [].<br/>Example: <b>[MyVar]</b>."
      );
    },

    ///////////////////////////////////////////////////////////////////////
    /////////////// xcmndCallActionOn
    ///////////////////////////////////////////////////////////////////////
    CV010: function(criteria) {
      return (
        "Unable to call a <b>" +
        criteria +
        "</b> action on a slide object because <b>" +
        criteria +
        "</b> is not listed as a valid action. " +
        "<br/>Please change <b>" +
        criteria +
        "</b> to <b>success, failure </b> or <b>focuslost</b>."
      );
    },
    CV011: function(slideObject) {
      return (
        "Tried to call a <b>focus lost</b> action on <b>" +
        slideObject +
        "</b>. However this interactive object has no <b>focus lost</b> action." +
        "<br/>Please ensure <b>" +
        slideObject +
        "</b> is a Text Entry Box."
      );
    },
    CV012: function(slideObject) {
      return (
        "Could not call action on <b>" +
        slideObject +
        "</b> as it is not an interactive object. " +
        "<br/>To resolve this issue, change <b>" +
        slideObject +
        "</b> to be an interactive object " +
        "(i.e. an object with success / failure criteria)."
      );
    },
    CV013: function(slideObject) {
      return (
        "Tried to call an action on <b>" +
        slideObject +
        "</b> but could not find any slide objects with that name. " +
        "<br/>Please ensure there is an interactive object with the name <b>" +
        slideObject +
        "</b>."
      );
    },

    ///////////////////////////////////////////////////////////////////////
    /////////////// xcmndSetCursor
    ///////////////////////////////////////////////////////////////////////
    CV020: function(cursorName) {
      return (
        "Tried to use xcmndSetCursor to apply cursor named <b>" +
        cursorName +
        "</b> to a slide object. " +
        "<b>" +
        cursorName +
        "</b> is not a valid cursor name. " +
        "<br/>Please check if you have misspelt the cursor name."
      );
    },

    ///////////////////////////////////////////////////////////////////////
    /////////////// xcmndAddEventListener and xcmndRemoveEventListener
    ///////////////////////////////////////////////////////////////////////
    CV030: function(slideObject, type) {
      var verb;
      if (type === "addEventListener") {
        verb = "add";
      } else if (type === "removeEventListener") {
        verb = "remove";
      }

      return (
        "Tried to " +
        verb +
        " an event listener on <b>" +
        slideObject +
        "</b> but could not find any slide objects with that name. " +
        "<br/>Please ensure there is a slide object with the name <b>" +
        slideObject +
        "</b>."
      );
    },
    CV031: function(event, type) {
      var verb;

      if (type === "addEventListener") {
        verb = "add";
      } else if (type === "removeEventListener") {
        verb = "remove";
      }

      return (
        "Unable to " +
        verb +
        " the <b>" +
        event +
        "</b> event because <b>" +
        event +
        "</b> is not listed as a valid event. " +
        "<br/>Please check the spelling of <b>" +
        event +
        "</b>."
      );
    },

    ///////////////////////////////////////////////////////////////////////
    /////////////// xcmndPosX, xcmndPosY, xcmndWidth, xcmndHeight
    ///////////////////////////////////////////////////////////////////////
    // TODO: Implement the following errors
    CV040: function(slideObject, property) {
      return (
        "Tried alter the <b>" +
        property +
        "</b> property on <b>" +
        slideObject +
        "</b> but could not find any slide objects with that name. " +
        "<br/>Please ensure there is a slide object with the name <b>" +
        slideObject +
        "</b>."
      );
    },
    CV041: function(slideObject, property, value) {
      return (
        "Tried to change the <b>" +
        property +
        "</b> property on <b>" +
        slideObject +
        "</b> to <b>" +
        value +
        "</b>, but that is not a valid value." +
        "<br/>Please check the spelling of <b>" +
        value +
        "</b>."
      );
    },
    CV042: function(variableName, slideObject, property) {
      return (
        "Tried to set variable <b>" +
        variableName +
        "</b> with value of slide object <b>" +
        slideObject +
        "'s " +
        property +
        "</b> property. However, could not find any slide object with the object name <b>" +
        slideObject +
        "</b>." +
        "<br/>Please check the spelling of <b>" +
        slideObject +
        "</b>."
      );
    },

    ///////////////////////////////////////////////////////////////////////
    /////////////// xcmndReset
    ///////////////////////////////////////////////////////////////////////
    CV050: function(variableName) {
      return (
        "Tried to reset variable <b>" +
        variableName +
        "</b> to its default value, but could not find any " +
        "variables by the name of <b>" +
        variableName +
        "</b>." +
        "<br/>Please check the spelling of <b>" +
        variableName +
        "</b>."
      );
    },

    ///////////////////////////////////////////////////////////////////////
    /////////////// xcmndFlushStorage
    ///////////////////////////////////////////////////////////////////////
    CV060: function(variableName) {
      return (
        "Tried to flush <b>" +
        variableName +
        "</b> from storage, but <b>" +
        variableName +
        "</b> " +
        "is not registered as a storage variable. " +
        "<br/>Storage variables should have a prefix of <b>ls_</b> or <b>ss_</b>." +
        "<br/>Other keywords that can be passed to <b>xcmndFlushStorage</b> are <b>local, session,</b> " +
        "and <b>all</b>" +
        "<br/>Please check the spelling of <b>" +
        variableName +
        "</b>."
      );
    },

    ///////////////////////////////////////////////////////////////////////
    /////////////// xcmndCompleteSlide
    ///////////////////////////////////////////////////////////////////////
    CV070: function(value) {
      return (
        "Tried to assign <b>xcmndCompleteSlide</b> an improper range of slides. Could not indentify what <b>" +
        value +
        "</b> is " +
        "supposed to represent. " +
        "<br>Please check the spelling of <b>" +
        value +
        "</b>."
      );
    },
    CV071: function(slideName) {
      return (
        "Tried to mark slide <b>" +
        slideName +
        "</b> as complete, but could not find any slide with the name <b>" +
        slideName +
        "</b>." +
        "<br/>Please check the spelling of <b>" +
        slideName +
        "</b>. Slide names are <b>case sensitive</b>. If the slide name contains spaces, " +
        'wrap the slide name in "double quotes."'
      );
    },
    CV072: function(slideNumber, slideCount) {
      return (
        "Tried to mark slide number <b>" +
        slideNumber +
        "</b> as complete, but there are only <b>" +
        slideCount +
        "</b> slides in the project." +
        "<br/>Perhaps you have deleted a few slides and this command needs updating."
      );
    },

    ///////////////////////////////////////////////////////////////////////
    /////////////// xcmndLoadJSFromAction
    ///////////////////////////////////////////////////////////////////////
    CV080: function(slideName) {
      return (
        "Tried to load javascript files from <b>" +
        slideName +
        "'s</b> success/failure actions." +
        "<br/>The action must be <b>Open URL or file</b> and it must point to a <b>.js file</b>" +
        "<br/>Please check the spelling of <b>" +
        slideName +
        "</b>"
      );
    }
  };
});
