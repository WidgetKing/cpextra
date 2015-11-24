/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/11/15
 * Time: 9:17 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("xprefDisablePlaybarScrubbing", ["preferenceManager", "cssManager", "softwareInterfacesManager"], function () {

    "use strict";

    var info = {

        "enable": function () {
            _extra.captivate.playbar.scrubbing = false;
        },

        "disable": function () {
            _extra.captivate.playbar.scrubbing = true;
        }

    };

    _extra.preferenceManager.registerPreferenceModule("DisablePlaybarScrubbing", info);


}, _extra.CAPTIVATE);