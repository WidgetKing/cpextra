/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/12/15
 * Time: 7:53 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("queryManager", function () {

    "use strict";

    _extra.WILDCARD_CHARACTER = "@";
    _extra.GLOBAL_WILDCARD_CHARACTER = "#";

    _extra.queryList = function(query, list, wildcard) {

        if (!wildcard) {
            wildcard = _extra.getQueryType(query);
        }

        var wildcardIndex = query.indexOf(wildcard);
        if (wildcardIndex > -1) {

            // There is a wildcard character in the query.

            // The following comments are written as if the query passed is is: My_@_Box

            // The part of the query before the wildcard character: My_
            var start = query.substr(0,wildcardIndex),
            // The part of the query after the wildcard character: _Box
                end = query.substr(wildcardIndex + 1, query.length - 1),
                returnList = [],
                evaluateItem = function (name) {
                    // Check if this slide objects's name matches the first part of the passed in query.
                    if (name.substr(0,start.length) === start) {

                        // Now check if it matches the last part.
                        if (name.substr(name.length - end.length, name.length - 1) === end) {

                            returnList.push(name);

                        }

                    }
                };

            if (list.constructor === _extra.w.Array) {

                for (var i = 0; i < list.length; i += 1) {

                    evaluateItem(list[i]);

                }

            } else if (typeof list === "object") {

                for (var property in list) {
                    if (list.hasOwnProperty(property)) {

                        evaluateItem(property);

                    }
                }

            }


            // If we have found no matches, then return nothing.
            if (returnList.length === 0) {
                returnList = null;
            }

            return returnList;
        }

        // Endpoint if no wildcard was passed in.
        return null;
    };

    _extra.isLocalQuery = function (query) {
        return query.indexOf(_extra.WILDCARD_CHARACTER) > -1;
    };

    _extra.isGlobalQuery = function (query) {
        return query.indexOf(_extra.GLOBAL_WILDCARD_CHARACTER) > -1;
    };

    _extra.isQuery = function (query) {
        return _extra.isLocalQuery(query) || _extra.isGlobalQuery(query);
    };

    _extra.getQueryType = function (query) {

        if (_extra.isLocalQuery(query)) {
            return _extra.WILDCARD_CHARACTER;
        } else if (_extra.isGlobalQuery(query)) {
            return _extra.GLOBAL_WILDCARD_CHARACTER;
        }

        return false;
    };


});