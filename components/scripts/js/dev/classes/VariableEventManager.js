/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/03/16
 * Time: 10:47 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule(
  "VariableEventManager",
  ["VariableEventProxy"],
  function() {
    "use strict";

    function VariableEventManager(softwareAddListener, softwareRemoveListener) {
      this._data = {};
      this._softwareAddListener = softwareAddListener;
      this._softwareRemoveListener = softwareRemoveListener;
    }

    _extra.registerClass("VariableEventManager", VariableEventManager);

    VariableEventManager.prototype.getListenerData = function(
      variableName,
      callback,
      remove
    ) {
      var variableHandlerArray, variableData;

      if (this._data.hasOwnProperty(variableName)) {
        variableHandlerArray = this._data[variableName];

        for (var i = 0; i < variableHandlerArray.length; i += 1) {
          variableData = variableHandlerArray[i];

          if (variableData.rawFunction === callback) {
            if (remove) {
              variableHandlerArray.splice(i, 1);
            }
            return variableData;
          }
        }
      }

      return null;
    };

    VariableEventManager.prototype.hasListener = function(
      variableName,
      callback
    ) {
      return this.getListenerData(variableName, callback) !== null;
    };

    VariableEventManager.prototype.addListener = function(
      variableName,
      callback
    ) {
      // Checking if we need to create a new array for this variable
      if (!this._data.hasOwnProperty(variableName)) {
        this._data[variableName] = [];

        // Checking if we have already created this listener
      } else if (this.hasListener(variableName, callback)) {
        return;
      }

      // Create variable Data
      var listenerData = {
        rawFunction: callback,
        wrappedFunction: function() {
          // TODO: We need to find a way to pass in the value of the variable here WITHOUT calling getVariableValue (See InfoManager.js for more information)

          listenerData.rawFunction(
            new _extra.classes.VariableEventProxy(arguments)
          );
        }
      };

      // Add variable data to the listeners record
      this._data[variableName].push(listenerData);

      // Forward on to the software
      this._softwareAddListener(variableName, listenerData.wrappedFunction);
    };

    VariableEventManager.prototype.removeListener = function(
      variableName,
      callback
    ) {
      var listenerData = this.getListenerData(variableName, callback, true);
      if (listenerData) {
        this._softwareRemoveListener(
          variableName,
          listenerData.wrappedFunction
        );
      }
    };
  }
);
