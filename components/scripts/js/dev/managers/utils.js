/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/3/19
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("utils", function () {

    "use strict";

    _extra.utils = {

        "addIfDefined": function (itemToAdd, list) {

            if (itemToAdd !== null &&
                itemToAdd !== undefined) {

                list.push(itemToAdd);

            }

        }

    };

});