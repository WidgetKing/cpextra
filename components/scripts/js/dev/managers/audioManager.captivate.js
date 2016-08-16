/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/5/16
 * Time: 3:02 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("audioManager", ["softwareInterfacesManager", "Callback", "hookManager"], function () {

    "use strict";

    _extra.audioManager = {
        "audioDataCallback": new _extra.classes.Callback()
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// Listen for when the native audio is set
    ///////////////////////////////////////////////////////////////////////
    _extra.addHookAfter(_extra.captivate.audioManager, "allocAudioChannel", function (audioData) {

        _extra.audioManager.audioDataCallback.sendToCallback(audioData.id, audioData);

    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// Find Native Audio
    ///////////////////////////////////////////////////////////////////////
    _extra.addHookAfter(_extra.audioManager.audioDataCallback, "addCallback", function (audioID, callback) {

        var audioData = _extra.captivate.audioManager.objectAudios[_extra.slideManager.currentInternalSlideId][audioID];

        if (audioData && audioData.nativeAudio) {
            callback(audioData);
        }

    });

}, _extra.CAPTIVATE);