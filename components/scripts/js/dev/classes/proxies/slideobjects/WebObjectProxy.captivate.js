/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 31/10/16
 * Time: 4:25 PM
 * To change this template use File | Settings | File Templates.
 */
/*_extra.registerModule("WebObjectProxy", ["BaseSlideObjectProxy"], function () {

    "use strict";

    function WebObjectProxy(element, data) {

        // Call super constructor
        _extra.classes.BaseSlideObjectProxy.call(this, element, data);

        var that = this;


        _extra.log(element);
    }

    _extra.registerClass("WebObjectProxy", WebObjectProxy, "BaseSlideObjectProxy", _extra.CAPTIVATE);

    WebObjectProxy.prototype.onSlideObjectInitialized = function () {

        // Super!
        WebObjectProxy.superClass.onSlideObjectInitialized.call(this);

        var iframe = _extra.w.document.getElementById("myFrame_" + this.name + "c");

        iframe.addEventListener("load", function () {

            var iframeDocument = iframe.contentWindow.document;


            // iframe loaded
            _extra.log("iFrame loaded");
            _extra.log(iframeDocument.getElementsByTagName('video'));

        });
        //_extra.log(this);
        //_extra.log(iframe);

    };

}, _extra.CAPTIVATE);*/