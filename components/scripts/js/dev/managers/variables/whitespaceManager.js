/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 14/06/16
 * Time: 1:25 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("whiteSpaceManager", ["variableManager"], function () {

    "use strict";

    _extra.variableManager.safelyRemoveWhiteSpace = function (value, replaceCommas) {
        // Remove spaces from value string
        //return value.replace(/\s+/g,'');

        if (!value || !value.replace) {
            return value;
        }

        // Regular expression for removing spaces except inside of quotation marks.
        // Quotation Marks: /([^"]+)|("[^"]+")/g
        // Allows escaping : /([^"]+)|("(?:[^"\\]|\\.)+")/
        return value.replace( /([^[]+)|(\[[^\]]+\])/g, function($0, $1, $2) {
           if ($1) {
               // Inside here we can make changes to everything OUTSIDE of ""
               // First we'll take all the commas and swap them out with the /u0000 character
               // which can't be typed. We will split on this character later.
               // This effectively allows us to maintain commas inside of ""
               // If we didn't do this and instead split on commas, then a "" string containing a comma
               // would be split in the middle, which would not be good.
               if (replaceCommas) {
                   $1 = $1.replace(/\,/g, replaceCommas);
               }

               // Remove whitespace characters from anywhere outside of double quotes.
               return $1.replace(/\s/g, '');
           } else {
               return $2;
           }
        });
    };

});