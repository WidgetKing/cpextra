/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/06/16
 * Time: 9:57 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("movieStatusManager", ["softwareInterfacesManager"], function () {

    "use strict";

    _extra.movieStatus = {

        "isPlaying" : function () {
            return !_extra.captivate.movie.paused;
        },

        "isPaused": function () {
            return _extra.captivate.movie.paused;
        }

    };


}, _extra.CAPTIVATE);