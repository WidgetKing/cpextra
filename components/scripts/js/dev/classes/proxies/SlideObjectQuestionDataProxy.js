/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/04/17
 * Time: 4:47 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("SlideObjectQuestionDataProxy", [], function () {

    "use strict";

    function SlideObjectQuestionDataProxy(data) {
        this.data = data;
        this.name = data.title;
    }

    SlideObjectQuestionDataProxy.prototype = {
        get score() {
            return this.data.getScore();
        },
        set score(value) {
            this.data.setScore(value);
        },
        get maxScore() {
            return this.data.weighting;
        }
    };

    _extra.registerClass("SlideObjectQuestionDataProxy", SlideObjectQuestionDataProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);