/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/09/15
 * Time: 4:15 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("softwareInterfacesManager", function () {

    "use strict";

    // References to storyline api
    _extra.storyline = {
        "api":_extra.w.story,
        "variables":_extra.w.story.variables,
        "player":_extra.w.player,
        "slidesData":_extra.w.story.allSlides
    };

    // TODO: Find Storyline Version variable

}, _extra.STORYLINE);