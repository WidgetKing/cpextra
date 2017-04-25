/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 28/03/16
 * Time: 4:06 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("URLManager", ["softwareInterfacesManager", "hookManager"], function () {

    "use strict";

    function hookIntoOpenURL(details) {

        _extra.addHookBefore(details.openURLLocation, details.openURLMethodName, function (url) {

            arguments[0] = _extra.variableManager.replaceVariablesInString(url);
            return arguments;

        });

    }

    hookIntoOpenURL(_extra.captivate || _extra.storyline);

});