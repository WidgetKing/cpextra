/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 9/26/18
 * Time: 7:17 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("animationManager", ["slideObjectManager_global", "globalSlideObjectTypes"], function () {

    "use strict";

    function init () {
        createAnimationManagerObject();
        _extra.slideObjects.enteredSlideChildObjectsCallbacks
              .addCallback(_extra.dataTypes.slideObjects.WEB_OBJECT, respondToNewAnimation);
    }

    function createAnimationManagerObject () {
        _extra.animationManager = {


        };
    }

    function respondToNewAnimation (animation) {

        _extra.animationManager.cpMate.parseAnimation(animation);

    }

    init();



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