/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("SlideDataProxy", function () {

    "use strict";

    function SlideDataProxy(data) {
        this.name = data.base.lb;
    }

    _extra.registerClass("SlideDataProxy", SlideDataProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);