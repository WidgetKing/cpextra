/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 25/04/17
 * Time: 2:39 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("replaceVariablesInString", ["variableManager_software"], function () {

    "use strict";

    _extra.variableManager.replaceVariablesInString = function (string) {


        var finalString = "",
            segment,
            splitString = string.split("$$");

        for (var i = 0; i < splitString.length; i += 1) {

            segment = splitString[i];

            /*
             * Suppose our url looked like this: place.com/?thing1=$$var1$$&thing2=$$var2$$
             * This would break down into the following
             * 0 = place.com/?thing1=
             * 1 = var1
             * 2 = &thing2=
             * 3 = var2
             *
             * Therefore it would be only the odd numbered values that we'd want to check as being variables.
             * The following if statement only passes if i is an odd number.
             * The reason why we don't just let this loop run on odd numbers is because we still need to add the
             * values of the even indexes into the finalString variable.
             */
            if (i % 2 === 1) {

                // If this variable exists, replace its name with the value of the variable.
                if (_extra.variableManager.hasVariable(segment)) {
                    segment = _extra.variableManager.getVariableValue(segment);
                    // If this variable doesn't exist, then we'll keep the variable name and the $$ it was surrounded
                    // to begin with.
                } else {
                    segment = "$$" + segment + "$$";
                }

            }

            finalString += segment;

        }

        return finalString;

    };

});