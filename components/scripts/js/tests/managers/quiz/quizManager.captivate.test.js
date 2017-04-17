/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/04/17
 * Time: 4:38 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.quizManager", function () {

    "use strict";

    var module = unitTests.getModule("quizManager", unitTests.CAPTIVATE);

    function createQuestionData (score, maxScore) {

        if (!maxScore) {
            maxScore = 10;
        }

        var data = {
            "score":score,
            "getScore": function () {
                return data.score;
            },
            "setScore": function (n) {
                data.score = n;
            },
            "weighting": maxScore
        };

        return data;
    }

    beforeEach(function () {

        var slideObjectQuestionDatas = {

            "interactiveObject":createQuestionData(0),

            "10Score": createQuestionData(10),

            "maxScore100": createQuestionData(0, 100),

            "maxScore3": createQuestionData(0,3)

        };

        window._extra = {
            "classes":unitTests.classes,
            "captivate":{
                "api":{
                    "getQuestionObject":function (n) {
                        return slideObjectQuestionDatas[n];
                    }
                }
            },
            "w":{
                "Math":Math
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.quizManager object", function () {
        expect(_extra.quizManager).toBeDefined();
    });

    it("should allow us to get access to a slide object's question data", function () {

        var result = _extra.quizManager.getSlideObjectQuestionData("interactiveObject");
        expect(result.data).toBe(_extra.captivate.api.getQuestionObject("interactiveObject"));

    });

    it("should allow us to get the current score of a slide object", function () {

        expect(_extra.quizManager.getSlideObjectScore("10Score")).toBe(10);

    });

    it("should allow us to set the current score of a slide object", function () {

        _extra.quizManager.setSlideObjectScore("10Score", 5);
        var originalData = _extra.captivate.api.getQuestionObject("10Score");
        expect(originalData.score).toBe(5);

    });

    it("should automatically jump to the highest score if we pass MAX", function () {

        _extra.quizManager.setSlideObjectScore("maxScore100", "max");
        var originalData = _extra.captivate.api.getQuestionObject("maxScore100");
        expect(originalData.score).toBe(100);


    });

    it("should automatically jump to the highest score if we pass MAX", function () {

        _extra.quizManager.setSlideObjectScore("maxScore100", "half");
        var originalData = _extra.captivate.api.getQuestionObject("maxScore100");
        expect(originalData.score).toBe(50);

        _extra.quizManager.setSlideObjectScore("maxScore3", "half");
        originalData = _extra.captivate.api.getQuestionObject("maxScore3");
        expect(originalData.score).toBe(2);

    });
});