/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/04/17
 * Time: 4:37 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("quizManager", [], function () {

    "use strict";

    _extra.quizManager = {

        "getSlideObjectQuestionData": function (slideObjectName) {
            var questionObject = _extra.captivate.api.getQuestionObject(slideObjectName);
            if (questionObject) {
                return new _extra.classes.SlideObjectQuestionDataProxy(questionObject);
            }
            return null;
        },

        "getSlideObjectScore": function (slideObjectName) {

            var data = _extra.quizManager.getSlideObjectQuestionData(slideObjectName);

            if (data) {
                return data.score;
            }

            return null;
        },

        "setSlideObjectScore": function (slideObjectName, score) {

            var data = _extra.quizManager.getSlideObjectQuestionData(slideObjectName);

            if (data) {

                // Special value which automatically sends
                if (score === "max") {

                    data.score = data.maxScore;

                } else if (score === "half") {

                    data.score = _extra.w.Math.round(data.maxScore / 2);

                } else {

                    data.score = score;

                }

            }

        }

    };

}, _extra.CAPTIVATE);