/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/06/16
 * Time: 1:57 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("ShapeDataProxy", ["BaseSlideObjectDataProxy"], function () {

    "use strict";

    function ShapeDataProxy(name, data, type) {

       // Call super constructor
       _extra.classes.BaseSlideObjectDataProxy.call(this, name, data, type);

   }


   _extra.registerClass("ShapeDataProxy", ShapeDataProxy, "BaseSlideObjectDataProxy", _extra.CAPTIVATE);

   _extra.w.Object.defineProperty(ShapeDataProxy.prototype,"strokeThickness", {
       get: function() {
           return this._data.container.sw;
       }
   });

}, _extra.CAPTIVATE);