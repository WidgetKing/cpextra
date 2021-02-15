/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/04/17
 * Time: 1:11 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule(
  "processCommandVariableRegistration",
  ["commandVariableManager"],
  function() {
    "use strict";

    _extra.variableManager.processCommandVariableRegistration = function(data) {
      /*var example = {
         "VariableSuffix":{
         "parameterHandler":handlers.sendParametersAsParameters
         "commandName":"enableMouseEvents",
         "updateData":function (data, a, b) {

         }
         "parseSet":_extra.variableManager.parseSets.SP.CD.SOR,
         "parseSetData":{
         "anything":null
         }
         }
         };*/

      function entryPoint() {
        for (var variableName in data) {
          if (data.hasOwnProperty(variableName)) {
            registerVariable(variableName, data[variableName]);
          }
        }
      }

      function registerVariable(variableName, data) {
        function entryPoint() {
          if (data.commandName) {
            _extra.variableManager.commands[
              data.commandName
            ] = handleVariableChange;
            _extra.X[data.commandName] = handleVariableChange;
          }

          // Register
          _extra.variableManager.registerCommandVariable(
            variableName,
            handleVariableChange,
            data.parameterHandler
          );
        }

        function handleVariableChange() {
          if (data.updateData) {
            // Make the first parameter the parseSetData
            _extra.w.Array.prototype.unshift.call(arguments, data.parseSetData);
            // Update data to the parameters we've received
            data.updateData.apply(this, arguments);

            data.parseSet(data.parseSetData);
          } else {
            _extra.error("You forgot to add a data.updateData method");
          }
        }

        entryPoint();
      }

      entryPoint();
    };
  }
);
