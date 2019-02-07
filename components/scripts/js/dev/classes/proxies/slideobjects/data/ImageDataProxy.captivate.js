/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/7/19
 * Time: 6:40 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("ImageDataProxy", ["BaseSlideObjectDataProxy"], function () {

    "use strict";

    function ImageDataProxy(name, data, type) {

        // Call super constructor
        _extra.classes.BaseSlideObjectDataProxy.call(this, name, data, type);

    }


    _extra.registerClass("ImageDataProxy", ImageDataProxy, "BaseSlideObjectDataProxy", _extra.CAPTIVATE);

    _extra.w.Object.defineProperty(ImageDataProxy.prototype,"serializedImageData", {
        get: function() {

            var data;
            var location = this.data.container.ip;

            _extra.captivate.movie.im.getImageDataURI(location, function (s) {
                data = s;
            });

            return data;
        }
    });

    ImageDataProxy.prototype.getImageTag = function () {

        var img = new _extra.w.Image();
        img.src = this.serializedImageData;
        return img;

    };


}, _extra.CAPTIVATE);