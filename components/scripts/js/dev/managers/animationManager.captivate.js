/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 9/26/18
 * Time: 7:17 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("animationManager", [], function () {

    "use strict";

    _extra.animationManager = {

        // called by the xcmndMatchEntryToEffect command variable
        "matchEntryToEffect": function (target, source, indexOfEffect) {

            function entryPoint () {

                var effectData = getEffectData();
                if (!effectData) {
                    // Add error here
                    return;
                }


            }

            function getEffectData () {
                var sourceData = _extra.dataManager.getSlideObjectDataByName(source),
                    sourceSlideData = _extra.slideManager.getSlideDataFromId(sourceData.slideName);

                if (!sourceSlideData.hasEffects) {
                    return false;
                }


                _extra.log(sourceSlideData.effects.getEffectsFor(source));
            }

            entryPoint();
        }

    };


    /*
     cp.D.Slide5317.g4

     var animationMenu = cp.D.Slide5317.g4.a2;
     var animationList = cp.D.Slide5317.g4.a1;

     function copyAnimation (sourceAnimationName, newAnimationName, suffix) {

     var animationData = animationMenu[sourceAnimationName];

     if (!animationData) {

     _extra.log("Failed to locate animation named: " + sourceAnimationName);
     return;

     }

     var newAnimationData = $.extend(true, {}, animationData);

     newAnimationData.a3 = newAnimationName;

     var animationID = newAnimationName + suffix;

     animationMenu[animationID] = newAnimationData;

     animationList.push([
     33,
     animationID
     ]);

     var objectData =
     cp.D[newAnimationName + "c"];

     objectData.JSONEffectData = true;


     }

     copyAnimation ("Shape_1x", "Shape_2", "x");
     copyAnimation ("Shape_1y", "Shape_2", "y");

     copyAnimation("Shape_1x", "Shape_3", "x");
     copyAnimation("Shape_1y", "Shape_3", "y");

     animationMenu;
     */
}, _extra.CAPTIVATE);